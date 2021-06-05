import { QuestionOne } from './../../../../core/models/question-one';
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { CustomerInformationService } from "app/core/service/customer-information.service";
import { CustomerInformation } from "app/core/models/customer-information.model";
import { isNullOrUndefined } from "util";
import { commonVariables } from 'environments/common-env-variables';
import { environment } from "environments/environment";
import { CommonDialogComponent } from "app/main/_shared/common-dialog/common-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { CheckNullOrUndefinedOrEmpty } from "app/core/utils/common-function";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmDialogComponent } from "./../../../_shared/confirm-dialog/confirm-dialog.component";
import * as jwt_decode from "jwt-decode";
import { ProfileService, QuestionnaireReport } from "app/core/service/profile.service";
import { QuestionTwo } from 'app/core/models/question-two';

@Component({
  selector: "app-customer-information",
  templateUrl: "./customer-information.component.html",
  styleUrls: ["./customer-information.component.scss"],
})
export class CustomerInformationComponent implements OnInit {

   questionOne = [];
  questionTwo = [];

 answerData = new QuestionnaireReport();

  // questionTwo= new QuestionTwo[];

  isShowChangeAdvisor: boolean = false;
  uuid: string;
  storageUrl = environment.storageUrl;
  customer = new CustomerInformation();
  imgAdvisor: string;
  imgRecruiter: string;
  imgTeamLeader: string;
  imgBranchManager: string;
  advisorId: string;
  advisorName: string;
  isShow: boolean = false;
  dataSearch: any;
  customerUpdateHistory: any = [];

  //Edit customer Credentials
  modeEditOrClosePhone: boolean = false;
  modeEditOrCloseEmail: boolean = false;
  modeEditOrCloseName: boolean = false;
  modeEditOrCloseQuestionairePre: boolean = false;
  modeEditOrCloseQuestionairePost: boolean = false;

  editOrClosePhone: string = "Edit";
  editOrCloseEmail: string = "Edit";
  editOrCloseNameIC: string = "Edit";
  editOrCloseQuestionairePre: string = "View";
  editOrCloseQuestionairePost: string = "View";

  inputPhone: string;
  inputEmail: string;
  inputName: string;

  phone_number_customer: string;
  email_customer: string;
  nameAsInIC: string;

  submmitPhone: boolean = false;
  submitEmail: boolean = false;
  submitName: boolean = false;

  emailForm: FormGroup;
  nameForm: FormGroup;
  emailPattern = /^[a-zA-Z0-9_\.\-\+]{1,32}@[a-zA-Z0-9\-]{2,}(\.[a-zA-Z0-9\-]{2,}){1,}$/;
  phoneNumberPattern: RegExp = /^[0-9]{8,}$/

  buttonName: string = "Submit";
  active: boolean = false;

  disableSubmitName: boolean = false;
  disableSubmitEmail: boolean = false;
  disableSubmitPhone: boolean = false;
  is_active: boolean;
  is_registered: boolean;
  phoneNumber: string;
  user_id: string;

  allowEditBankInfo: boolean;

  // bank name
  bankName: string;
  isEditBankName: boolean;
  editBankName: string;
  bankNameFormGroup: FormGroup;
  activeBankName: boolean;
  inputEditBankName: string;

  // bank account
  bankAccount: string;
  bankAccountHidden: string;
  isEditBankAccount: boolean;
  editBankAccount: string;
  bankAccountFormGroup: FormGroup;
  activeBankAccount: boolean;
  inputEditBankAccount: string;
  showBankAccount: boolean;

  // bank code
  bankCode: string;
  isEditBankCode: boolean;
  editBankCode: string;
  bankCodeFormGroup: FormGroup;
  activeBankCode: boolean;
  inputEditBankCode: string;
  listBankCode: any[];

  decoded: any;
  QF1CompleteStatus = '-';
  QF2CompleteStatus = '-';

  version1 = environment.questionnaireOneVersion;
  version2 = environment.questionnaireTwoVersion;


  constructor(
    private location: Location,
    private router: ActivatedRoute,
    private customerService: CustomerInformationService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private myProfileService: ProfileService,

  ) {}

  ngOnInit(): void {


    this.router.queryParams.subscribe((params) => {
      this.uuid = params.id;
    });

    // bank name
    this.bankName = "";
    this.isEditBankName = false;
    this.editBankName = "Edit";
    this.bankNameFormGroup = this._formBuilder.group({
      bankNameFormControl: ["", [Validators.required]],
    });
    this.activeBankName = false;
    this.inputEditBankName = "";

    // bank account
    this.bankAccount = "";
    this.bankAccount = "";
    this.isEditBankAccount = false;
    this.editBankAccount = "Edit";
    this.bankAccountFormGroup = this._formBuilder.group({
      bankAccountFormControl: [
        "",
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
    });
    this.activeBankAccount = false;
    this.inputEditBankAccount = "";
    this.showBankAccount = false;

    // bank code
    this.bankCode = "";
    this.isEditBankCode = false;
    this.editBankCode = "Edit";
    this.bankCodeFormGroup = this._formBuilder.group({
      bankCodeFormControl: ["", [Validators.required]],
    });
    this.activeBankCode = false;
    this.inputEditBankCode = "";

    this.decoded = jwt_decode(localStorage.getItem("token"));
    this.allowEditBankInfo = this.decoded.role.includes("RETAIL_ADMIN_EDIT_BANK");
    if (this.decoded.entity_id === "1") {
      this.listBankCode = commonVariables.SingaporeBank;
    } else if (this.decoded.entity_id === "2") {
      this.listBankCode = commonVariables.MalaysiaBank;
    }

    this.myProfileService.getQuestionnaireStatus(this.version1, this.version2,this.uuid).subscribe(response => {
      this.QF1CompleteStatus = response.questionnaireOneStatus;
      this.QF2CompleteStatus = response.questionnaireTwoStatus;
    });


    this.myProfileService.getDataQuestionnaireOne(this.version1, this.uuid).subscribe(
      data => {
        this.questionOne = data;
        this.questionOne.forEach(element => {

          this.answerData.answer1 = element.answer1
          this.answerData.answer2 = element.answer2
          this.answerData.answer3 = element.answer3
          this.answerData.answer4 = element.answer4
          this.answerData.answer5 = element.answer5
          this.answerData.answer6 = element.answer6
          this.answerData.answer7 = element.answer7
          this.answerData.answer8 = element.answer8
          this.answerData.answer9 = element.answer9
        });
      //  console.log(this.questionOne);
      }
    )

    this.myProfileService.getDataQuestionnaireTwo(this.version1, this.uuid).subscribe(
      data => {
        this.questionTwo = data;
        this.questionTwo.forEach(element => {
        this.answerData.answer10 = element.answer10
        this.answerData.answer11 = element.answer11
        this.answerData.answer12 = element.answer12
        this.answerData.answer13 = element.answer13
        this.answerData.answer14 = element.answer14

      });
      }
    )
    this.getDataCustomer();
  }


  getDataCustomer() {
    this.customerService.getCustomerByUuid(this.uuid).subscribe((data) => {
      this.customer = data;
      this.phone_number_customer = this.customer.phoneNumberAndDialCode;
      this.email_customer = this.customer.email;
      this.nameAsInIC = this.customer.nameAsInIC;
      this.is_active = this.customer.is_active;
      this.is_registered = this.customer.is_registered;
      this.phoneNumber = this.customer.phoneNumberTemp;
      this.user_id = this.customer.id;

      if (!CheckNullOrUndefinedOrEmpty(data.advisorPhotoKey)) {
        this.imgAdvisor = this.storageUrl + data.advisorPhotoKey;
      } else {
        this.imgAdvisor = "assets/icons/doxa-icons/Account Circle.svg";
      }

      if (!CheckNullOrUndefinedOrEmpty(data.recruiterPhotoKey)) {
        this.imgRecruiter = this.storageUrl + data.recruiterPhotoKey;
      } else {
        this.imgRecruiter = "assets/icons/doxa-icons/Account Circle.svg";
      }

      if (!CheckNullOrUndefinedOrEmpty(data.branchManagerPhotoKey)) {
        this.imgBranchManager = this.storageUrl + data.branchManagerPhotoKey;
      } else {
        this.imgBranchManager = "assets/icons/doxa-icons/Account Circle.svg";
      }

      if (!CheckNullOrUndefinedOrEmpty(data.teamLeaderPhotoKey)) {
        this.imgTeamLeader = this.storageUrl + data.teamLeaderPhotoKey;
      } else {
        this.imgTeamLeader = "assets/icons/doxa-icons/Account Circle.svg";
      }


      this.bankName = this.customer.bank_name;
      this.bankCode = this.customer.bank_code;
      this.bankAccount = this.customer.bank_account;
      this.bankAccountHidden = this.bankAccount.replace(/[0-9]/g, '*');
      this.bankCodeFormGroup.patchValue({
        bankCodeFormControl: this.listBankCode.find(x => x.bank_code === this.bankCode)
      });

      this.customerUpdateHistory = this.customer.customerUpdateHistory;

      if (!this.allowEditBankInfo) {
        this.customerUpdateHistory = this.customerUpdateHistory.filter(x => x.isEditBank === false);
      }
    });
  }

  changeAdvisor() {
    if (this.isShowChangeAdvisor) {
      this.isShowChangeAdvisor = false;

      if (!CheckNullOrUndefinedOrEmpty(this.customer.advisorPhotoKey)) {
        this.imgAdvisor = this.storageUrl + this.customer.advisorPhotoKey;
      } else {
        this.imgAdvisor = "assets/icons/doxa-icons/Account Circle.svg";
      }
    } else {
      this.isShowChangeAdvisor = true;

      if (!CheckNullOrUndefinedOrEmpty(this.customer.advisorName)) {
        this.advisorName = this.customer.advisorName;
        this.advisorId = this.customer.advisorId;
      }
    }
  }

  searchAdvisorId(value) {
    if (value === "") {
      this.advisorId = "";
      this.advisorName = "";
      this.imgAdvisor = "assets/icons/doxa-icons/Account Circle.svg";
      return;
    } else {
      this.isShow = false;
    }

    this.customerService.searchAdvisorByAdvisorId(value).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.dataSearch = data;
        this.advisorName = data.advisorName;
        this.advisorId = data.advisorId;

        if (!CheckNullOrUndefinedOrEmpty(data.advisorPhotoKey)) {
          this.imgAdvisor = this.storageUrl + data.advisorPhotoKey;
        } else {
          this.imgAdvisor = "assets/icons/doxa-icons/Account Circle.svg";
        }
      } else {
        this.advisorName = "";
        this.imgAdvisor = "assets/icons/doxa-icons/Account Circle.svg";
      }
    });
  }

  back() {
    this.location.back();
  }

  saveAdvisor() {
    if (this.advisorId === "") {
      this.isShow = true;
      return;
    } else {
      this.customerService
        .updateAdvisor(this.uuid, this.advisorId)
        .subscribe((data) => {
          if (data.code === 200) {
            this.isShowChangeAdvisor = false;
            this.advisorId = this.dataSearch.advisorId;
            this.advisorName = this.dataSearch.advisorName;

            if (!CheckNullOrUndefinedOrEmpty(data.advisorPhotoKey)) {
              this.imgAdvisor =
                this.storageUrl + this.dataSearch.advisorPhotoKey;
            } else {
              this.imgAdvisor = "assets/icons/doxa-icons/Account Circle.svg";
            }

            this.getDataCustomer();
          }
        });
    }
  }

  changePhone() {
    this.modeEditOrClosePhone = !this.modeEditOrClosePhone;
    if (this.modeEditOrClosePhone) {
      this.editOrClosePhone = "Close";
      this.inputPhone = !CheckNullOrUndefinedOrEmpty(this.inputPhone)
        ? this.inputPhone
        : this.customer.phoneNumber;
    } else {
      this.editOrClosePhone = "Edit";
    }
  }

  viewQuestionairePre() {
    this.modeEditOrCloseQuestionairePre = !this.modeEditOrCloseQuestionairePre;
    if (this.modeEditOrCloseQuestionairePre) {
      this.editOrCloseQuestionairePre = "Close";

    } else {
      this.editOrCloseQuestionairePre = "View";
    }
  }

  viewQuestionairePost() {
    this.modeEditOrCloseQuestionairePost = !this.modeEditOrCloseQuestionairePost;
    if (this.modeEditOrCloseQuestionairePost) {
      this.editOrCloseQuestionairePost = "Close";
    } else {
      this.editOrCloseQuestionairePost = "View";
    }
  }

  changeName() {
    this.modeEditOrCloseName = !this.modeEditOrCloseName;
    if (this.modeEditOrCloseName) {
      this.editOrCloseNameIC = "Close";
      this.inputName = !CheckNullOrUndefinedOrEmpty(this.inputName)
        ? this.inputName
        : this.customer.nameAsInIC;
    } else {
      // this.inputPhone = "";
      this.editOrCloseNameIC = "Edit";
    }
  }

  changeEmail() {
    this.modeEditOrCloseEmail = !this.modeEditOrCloseEmail;
    if (this.modeEditOrCloseEmail) {
      this.editOrCloseEmail = "Close";
      // this.inputEmail = this.email_customer;
      this.emailForm = this._formBuilder.group({
        email: [
          "",
          [Validators.required, Validators.pattern(this.emailPattern)],
        ],
      });

      this.emailForm.patchValue({
        email: this.email_customer,
      });
    } else {
      this.editOrCloseEmail = "Edit";
    }
  }

  keyPressNumbers(event) {
    let charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  checkValidPhoneNumber() {
    return this.phoneNumberPattern.test(this.inputPhone);
  }

  activePhone = false;
  activeEmail = false;

  updatePhone() {
    this.submmitPhone = true;
    this.activePhone = true;
    if (
      CheckNullOrUndefinedOrEmpty(this.inputPhone) ||
      this.inputPhone.length < 8 ||
      !this.checkValidPhoneNumber()
    ) {
      this.activePhone = false;
      this.disableSubmitPhone = false;
      return;
    } else if (this.disableSubmitPhone) {
      return;
    } else {
      this.disableSubmitPhone = true;
      this.customerService
        .updatePhoneNumber(this.uuid, this.inputPhone)
        .subscribe((data) => {
          if (data.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "Update phone number successfully.",
                title: "NOTIFICATION",
                colorButton: false,
              },
            });
            this.activePhone = false;
            this.disableSubmitPhone = false;
            dialogNotifi.afterClosed().subscribe(() => {
              this.getDataCustomer();
              this.modeEditOrClosePhone = false;
              this.editOrClosePhone = "Edit";
            });
          } else if (data.code === 202) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "This phone number already exists. Please retry.",
                title: "NOTIFICATION",
                colorButton: true,
              },
            });
            this.activePhone = false;
            this.disableSubmitPhone = false;
          } else {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "Error when update phone number. Please retry.",
                title: "NOTIFICATION",
                colorButton: true,
              },
            });
            this.activePhone = false;
            this.disableSubmitPhone = false;
          }
        });
    }
  }

  updateName() {
    this.submitName = true;
    this.active = true;
    if (CheckNullOrUndefinedOrEmpty(this.inputName)) {
      this.active = false;
      this.disableSubmitName = false;
      return;
    } else if (this.disableSubmitName) {
      return;
    } else {
      //  this.inputName = this.emailName.value.email
      this.disableSubmitName = true;
      this.customerService
        .updateNameinIC(this.uuid, this.inputName)
        .subscribe((data) => {
          if (data.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "Update name successfully.",
                title: "NOTIFICATION",
                colorButton: false,
              },
            });
            this.active = false;
            this.disableSubmitName = false;
            dialogNotifi.afterClosed().subscribe(() => {
              this.getDataCustomer();
              this.modeEditOrCloseName = false;
              this.editOrCloseNameIC = "Edit";
            });
          } else {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "Error when update name. Please retry.",
                title: "NOTIFICATION",
                colorButton: true,
              },
            });
            this.active = false;
            this.disableSubmitName = false;
          }
        });
    }
  }

  updateEmail() {
    this.submitEmail = true;
    this.activeEmail = true;
    if (this.emailForm.invalid) {
      this.activeEmail = false;
      this.disableSubmitEmail = false;
      return;
    } else if (this.disableSubmitEmail) {
      return;
    } else {
      this.disableSubmitEmail = true;
      this.inputEmail = this.emailForm.value.email;
      this.customerService
        .updateEmail(this.uuid, this.inputEmail)
        .subscribe((data) => {
          if (data.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "Update email successfully.",
                title: "NOTIFICATION",
                colorButton: false,
              },
            });
            this.activeEmail = false;
            this.disableSubmitEmail = false;
            dialogNotifi.afterClosed().subscribe(() => {
              this.getDataCustomer();
              this.modeEditOrCloseEmail = false;
              this.editOrCloseEmail = "Edit";
            });
          } else if (data.code === 202) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "This email address already exists. Please retry.",
                title: "NOTIFICATION",
                colorButton: true,
              },
            });
            this.activeEmail = false;
            this.disableSubmitEmail = false;
          } else {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "Error when update email. Please retry.",
                title: "NOTIFICATION",
                colorButton: true,
              },
            });
            this.activeEmail = false;
            this.disableSubmitEmail = false;
          }
        });
    }
  }

  verifyEmail() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: { message: "Are you sure to verify this email?", type: "APPROVED" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        let user_id = {
          user_id: this.user_id,
          email: this.email_customer,
        };
        this.customerService.verifyEmail(user_id).subscribe((data) => {
          if (data.code == 200) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              width: "500px",
              data: { message: "Your email is verified.", type: "ACCEPTED" },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result == true) {
                this.getDataCustomer();
              }
            });
          }
        });
      } else {
        dialogRef.close();
      }
    });
  }

  verifyPhone() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: { message: "Are you sure to verify this phone?", type: "APPROVED" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        let user_id = {
          user_id: this.user_id,
          phone: this.phoneNumber,
        };
        this.customerService.verifyPhone(user_id).subscribe((data) => {
          if (data.code == 200) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              width: "500px",
              data: {
                message: "Your phone number is veried.",
                type: "ACCEPTED",
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result == true) {
                this.getDataCustomer();
              }
            });
          }
        });
      } else {
        dialogRef.close();
      }
    });
  }

  changeBankName() {
    this.isEditBankName = !this.isEditBankName;
    if (this.isEditBankName) {
      this.editBankName = "Close";
      this.inputEditBankName = this.bankName;
      this.bankNameFormGroup.patchValue({
        bankNameFormControl: this.inputEditBankName,
      });
    } else {
      this.editBankName = "Edit";
    }
  }

  updateBankName() {
    if (this.bankNameFormGroup.invalid || !this.bankNameFormGroup.dirty) return;

    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: {
        message: "Are you sure to update this Bank holder?",
        type: "APPROVED",
      },
    });

    dialogConfirm.afterClosed().subscribe((result) => {
      if (result === true) {
        this.activeBankName = true;
        let body = {
          bankName: this.bankNameFormGroup.value.bankNameFormControl,
        };
        this.customerService.editBankInfo(this.uuid, body).subscribe((response) => {
          this.activeBankName = false;
          if (response && response.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: response.message || "Update bank holder successfully.",
                title: "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe((result) => {
              this.bankName = this.bankNameFormGroup.value.bankNameFormControl;
              this.changeBankName();
              this.getDataCustomer();
            });
          } else if (response && response.code !== 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: response.message || "Update bank holder failed",
                title: "NOTIFICATION",
                colorButton: true
              },
            });
            dialogNotifi.afterClosed().subscribe((result) => {
              return;
            });
          } else {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "Something went wrong! Please try again.",
                title: "NOTIFICATION",
                colorButton: true
              },
            });
            dialogNotifi.afterClosed().subscribe((result) => {
              return;
            });
          }
        });
      } else {
        dialogConfirm.close();
      }
    });
  }

  changeBankAccount() {
    this.isEditBankAccount = !this.isEditBankAccount;
    if (this.isEditBankAccount) {
      this.editBankAccount = "Close";
      this.inputEditBankAccount = this.bankAccount;
      this.bankAccountFormGroup.patchValue({
        bankAccountFormControl: this.inputEditBankAccount,
      });
    } else {
      this.editBankAccount = "Edit";
    }
  }

  updateBankAccount() {
    if (this.bankAccountFormGroup.invalid || !this.bankAccountFormGroup.dirty) return;

    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: {
        message: "Are you sure to update this Bank account?",
        type: "APPROVED",
      },
    });

    dialogConfirm.afterClosed().subscribe((result) => {
      if (result === true) {
        this.activeBankAccount = true;
        let body = {
          bankAccount: this.bankAccountFormGroup.value.bankAccountFormControl,
        };
        this.customerService.editBankInfo(this.uuid, body).subscribe((response) => {
          this.activeBankAccount = false;
          if (response && response.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: response.message || "Update bank account successfully.",
                title: "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe((result) => {
              this.bankAccount = this.bankAccountFormGroup.value.bankAccountFormControl;
              this.bankAccountHidden = this.bankAccount.replace(/[0-9]/g, '*');
              this.changeBankAccount();
              this.getDataCustomer();
            });
          } else if (response && response.code !== 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: response.message || "Update bank account failed",
                title: "NOTIFICATION",
                colorButton: true
              },
            });
            dialogNotifi.afterClosed().subscribe((result) => {
              return;
            });
          } else {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "Something went wrong! Please try again.",
                title: "NOTIFICATION",
                colorButton: true
              },
            });
            dialogNotifi.afterClosed().subscribe((result) => {
              return;
            });
          }
        });
      } else {
        dialogConfirm.close();
      }
    });
  }

  onKeyNumber(e) {
    let charCode = e.which ? e.which : e.keyCode;
    var charStr = String.fromCharCode(charCode);
    if (!(/\d/.test(charStr)) && charCode !== 13) {
      e.preventDefault();
      return false;
    } else return true;
  }

  changeBankCode() {
    this.isEditBankCode = !this.isEditBankCode;
    if (this.isEditBankCode) {
      this.editBankCode = "Close";
      this.inputEditBankCode = this.bankCode;
      this.bankCodeFormGroup.patchValue({
        bankCodeFormControl: this.listBankCode.find(x => x.bank_code === this.bankCode)
      })
    } else {
      this.editBankCode = "Edit";
    }
  }

  updateBankCode() {
    if (this.bankCodeFormGroup.invalid || !this.bankCodeFormGroup.dirty) return;

    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: {
        message: "Are you sure to update this Bank code?",
        type: "APPROVED",
      },
    });

    dialogConfirm.afterClosed().subscribe((result) => {
      if (result === true) {
        this.activeBankCode = true;
        let body = {
          bankCode: this.bankCodeFormGroup.value.bankCodeFormControl.bank_code,
        };
        this.customerService.editBankInfo(this.uuid, body).subscribe((response) => {
          this.activeBankCode = false;
          if (response && response.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: response.message || "Update bank code successfully.",
                title: "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe((result) => {
              this.bankCode = this.bankCodeFormGroup.value.bankCodeFormControl.bank_code;
              this.changeBankCode();
              this.getDataCustomer();
            });
          } else if (response && response.code !== 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: response.message || "Update bank code failed",
                title: "NOTIFICATION",
                colorButton: true
              },
            });
            dialogNotifi.afterClosed().subscribe((result) => {
              return;
            });
          } else {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: "Something went wrong! Please try again.",
                title: "NOTIFICATION",
                colorButton: true
              },
            });
            dialogNotifi.afterClosed().subscribe((result) => {
              return;
            });
          }
        });
      } else {
        dialogConfirm.close();
      }
    });
  }
}
