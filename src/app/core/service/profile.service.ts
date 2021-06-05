import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { getDataProfile, updateImageProfile,
  changePassword, changeName, questionnaireStatusApi, questionnairePreApi, questionnairePostApi} from "./backend-api";
import { Observable, throwError } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import { formatDate } from "@angular/common";
import { Profile } from "../models/profile.model";
import * as _ from 'lodash';
import { environment } from "environments/environment";
import { P2_Q1, P2_Q2, P2_Q3, P2_Q4, P2_Q5, P2_Q6, P2_Q7, P2_Q8, Q1_DATA, Q3_DATA, Q4_DATA, Q5_DATA, P2_Q9_MODEL } from '../constants/constant';


@Injectable({
  providedIn: "root",
})
export class ProfileService {

  q1data = P2_Q1;
  q2data = P2_Q2;
  q3data = P2_Q3;
  q4data = P2_Q4;
  q5data = P2_Q5;
  q6data = P2_Q6;
  q7data = P2_Q7;
  q8data = P2_Q8;
  q9Model = P2_Q9_MODEL;
  q10data = Q1_DATA;
  q12data = Q3_DATA;
  q13data = Q4_DATA;
  q14data = Q5_DATA;



  constructor(private api: ApiService, private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.api.get(getDataProfile).pipe(
      map((data) => {
        if (data.code === 200 && !isNullOrUndefined(data.data)) {
          let profile = new Profile();

          profile.name = data.data.name;
          profile.user = data.data.user;
          profile.email = data.data.email;
          profile.profilePhotoKey = data.data.profile_photo_key;
          profile.company = data.data.company;

          profile.role = "";
          data.data.role.forEach((element, index) => {
            if(index === (data.data.role.length - 1) )
            {
            profile.role += _.startCase(_.camelCase(element));

            }else{
            profile.role += _.startCase(_.camelCase(element)) + ", ";

            }
          });

          // profile.role = _.join([data.data.role], ',');
          // profile.role = _.join([data.data.role], "' '");

          return profile;
        }
      })
    );
  }

  updateImageProfile(fileName: string, fileType: string): Observable<any> {
    let formImage = { name: fileName, type: fileType };
    return this.api.post(updateImageProfile, formImage);
  }

  uploadProfileImage(url: string, contentType: string, file) {
    const headers = new HttpHeaders({ "Content-Type": contentType });
    return this.http.put<any>(url, file, {
      headers: headers,
      reportProgress: true,
    });
  }

  changePassword(formPassword): Observable<any> {
    return this.api.post(changePassword, formPassword);
  }

  changeName(formName): Observable<any> {
    return this.api.post(changeName, formName);
  }


  getQuestionnaireStatus(version1, version2, uuid) {

    let url = questionnaireStatusApi.replace(":version1",version1).replace
    (":version2",version2).replace(":id", uuid)
    return this.api.get(url);


  }

  getDataQuestionnaireOne(version, uuid) {
    let listAnswer = [];
    let url = questionnairePreApi.replace(":ver",version).replace(":id", uuid)
    return this.api.get(url).pipe(map ((data)=>{
      // console.log(data);
      let answerData = new QuestionnaireReport();
      if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.questionnaire)) {
        if (data.questionnaire.questionnaire_type === 'BEFORE') {
          if (!CheckNullOrUndefinedOrEmpty(data.questionnaire.answer)) {
            answerData.answer1 =  this.checkDataAnswer(data.questionnaire.answer.p2q1, this.q1data, null) ;
            answerData.answer2 =  this.checkDataAnswer(data.questionnaire.answer.p2q2, this.q2data, data.questionnaire.answer.p2q2Text);
            answerData.answer3 = this.checkDataAnswer(data.questionnaire.answer.p2q3, this.q3data, null);
            // answerData.answer4 =  this.q4data.filter(e => e.id === data.questionnaire.answer.p2q4)[0].text+".";
            // answerData.answer5 = this.q5data.filter(e => e.id === data.questionnaire.answer.p2q5)[0].text+".";
            answerData.answer4 =  this.q4data[data.questionnaire.answer.p2q4 - 1].text + ".";
            answerData.answer5 =  this.q5data[data.questionnaire.answer.p2q5 - 1].text + ".";
            answerData.answer6 =  this.checkDataAnswer(data.questionnaire.answer.p2q6, this.q6data, null);
            answerData.answer7 =  this.checkDataAnswer(data.questionnaire.answer.p2q7, this.q7data, null);
            answerData.answer8 =  this.checkDataAnswer(data.questionnaire.answer.p2q8, this.q8data, data.questionnaire.answer.p2q8Text) ;

            if (data.questionnaire.answer.p2q9 === 1) {
                answerData.answer9 = this.q9Model.filter(e => e.id === data.questionnaire.answer.p2q9Model)[0].text+".";
            } else {
                answerData.answer9 = 'No';
            }

            listAnswer.push(answerData);
        }
        }
        return listAnswer;
    } else {
        return [];
    }
  }))

  }
  getDataQuestionnaireTwo(version, uuid) {
    let url = questionnairePostApi.replace(":ver",version).replace(":id", uuid)
    let listAnswer = [];

    return this.api.get(url).pipe(map ((data)=>{
      // return data;

      let answerData = new QuestionnaireReport();
      if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.questionnaire)) {
        if (data.questionnaire.questionnaire_type === 'AFTER') {
          if (!CheckNullOrUndefinedOrEmpty(data.questionnaire.answer)) {

            answerData.answer10 = this.checkDataAnswer(data.questionnaire.answer.q1, this.q10data, null);
            answerData.answer11 = data.questionnaire.answer.q2+ "." ;
            answerData.answer12 = this.checkDataAnswer(data.questionnaire.answer.q3, this.q12data, null) ;
            answerData.answer13 = this.q13data[data.questionnaire.answer.q4 - 1].text+"." ;
            answerData.answer14 = this.q14data[data.questionnaire.answer.q5 - 1].text+"." ;
            listAnswer.push(answerData);
         }
        }
        return listAnswer;
    } else {
        return [];
    }

  }))

  }


  checkDataAnswer(data, dataArr, textInput) {
    let answer = '';

    if (!CheckNullOrUndefinedOrEmpty(data)) {

        let arr = data.split(',');

        arr.forEach((a1, i) => {
            if (i === arr.length - 1) {

                if (!isNaN(a1)) {
                    if (dataArr[Number(a1)].text === 'Others' && !CheckNullOrUndefinedOrEmpty(textInput)) {
                        answer += textInput + ", ";
                    } else {
                        answer += dataArr[Number(a1)].text + ', ' ;
                    }

                } else {
                    answer += '';
                }

            } else {
                if (dataArr[Number(a1)].text === 'Others' && !CheckNullOrUndefinedOrEmpty(textInput)) {
                    answer += textInput + ', ';
                } else {
                    answer += dataArr[Number(a1)].text + ', ';
                }
            }
        });
    } else {
        answer = '';
    }
   // console.log(answer)
    return answer.substring(0, answer.length - 2) + '.';

}


  private errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        console.error('An error occured:', error.error.message);
    }
    else {
        console.error(
            `Back-end return code: ${error.status}\n` +
            `Body content: ${error.status}`
        );
    }

    return throwError(error.message || 'Server Error');
}
}


export class QuestionnaireReport {
  nameInIC: string;
  preferredName: string;
  email: string;
  phoneNumber: string;
  answer1: string = '';
  answer2: string = '';
  answer3: string = '';
  answer4: string = '';
  answer5: string = '';
  answer6: string = '';
  answer7: string = '';
  answer8: string = '';
  answer9: string = '';
  answer10: string = '';
  answer11: string = '';
  answer12: string = '';
  answer13: string = '';
  answer14: string = '';
}
