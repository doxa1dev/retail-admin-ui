import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from 'app/core/service/profile.service';
import { Profile } from 'app/core/models/profile.model';
import { isNullOrUndefined } from 'util';
import { environment } from 'environments/environment';
import { ToolbarService } from 'app/core/service/toolbar.service';
import Swal from 'sweetalert2';
import { MustMatch } from 'app/main/pages/authentication/_helper/must-match.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  isShowChangePass: boolean = false;
  isShowChangeName: boolean = false;
  changePasswordForm: FormGroup;
  changeNameForm: FormGroup;
  isShow: boolean = false;
  isShowName: boolean = false;
  imgProfile: string;
  profile = new Profile();
  storageUrl = environment.storageUrl;
  isShowFail: boolean = false;
  massagePassword: string;

  constructor(private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private toolBarService: ToolbarService) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, , Validators.minLength(8)]],
      newPassword: ['', [Validators.required, , Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, , Validators.minLength(8)]]
    },
    {
      validators: [ MustMatch('newPassword', 'confirmPassword')]
    })

    this.changeNameForm = this.formBuilder.group({
      newName: ['', Validators.required],
      // newUser: ['', Validators.required]
    })

    this.getDataProfile();
  }

  getDataProfile() {
    this.profileService.getProfile().subscribe( data => {
      this.profile = data

      if (!isNullOrUndefined(data.profilePhotoKey)) {
        this.imgProfile = this.storageUrl + data.profilePhotoKey
      } else {
        this.imgProfile = "assets/icons/doxa-icons/Account Circle.svg"
      }
    })
  }

  changePassword() {
    if (this.isShowChangePass) {
      this.isShowChangePass = false;

      this.changePasswordForm.setValue({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } else {
      this.isShowChangePass = true;
      this.isShow = false;
    }
  }

  onFileDropped($event) {
    this.onSelectFile($event)

  }
  savePassword() {
    this.isShow = true;
    if (this.changePasswordForm.invalid)
    {
      return;
    } else {
      this.isShow = false;

      let formPassword = {
        confirmPassword: this.changePasswordForm.value.confirmPassword,
        newPassword: this.changePasswordForm.value.newPassword,
        oldPassword: this.changePasswordForm.value.currentPassword
      }

      this.profileService.changePassword(formPassword).subscribe(
        data => {
          if (data.code === 200) {
            this.isShowFail = false;
            Swal.fire({
              text: 'Password changed successfully!',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            });

            setTimeout(() => { this.isShowChangePass = false; }, 500);

            this.changePasswordForm.setValue({
              currentPassword: "",
              newPassword: "",
              confirmPassword: ""
            });

          } else if (data.code === 201) {
            this.isShowFail = true;
            this.massagePassword = data.message;
            this.changePasswordForm.get('currentPassword').markAsPristine();
          } else if (data.code === 304) {
            Swal.fire({
              title: 'No change in password',
              text: 'Please change again!',
            });
          }
        }
      )
    }
  }

  changeName() {
    if (this.isShowChangeName) {
      this.isShowChangeName = false;

      this.changeNameForm.setValue({
        newName: "",
        // newUser: ""
      });
    } else {
      this.isShowChangeName = true;

      this.changeNameForm.setValue({
        newName: this.profile.name,
        // newUser: this.profile.user
      });
    }
  }

  saveName() {
    this.isShowName = true;
    if (this.changeNameForm.invalid)
    {
      return;
    } else {
      this.isShowName = false;

      let formName = {
        first_name: "",
        last_name: this.changeNameForm.value.newName,
      }

      this.profileService.changeName(formName).subscribe(
        data => {
          if (data.code === 200) {
            this.isShowChangeName = false;
            this.getDataProfile();

            this.changeNameForm.setValue({
              newName: "",
              // newUser: ""
            });
          }
        }
      )
    }
  }

  onSelectFile(files): void {
    if (files.length > 0) {
      const file = files[0];
      if (file.type != "image/bmp" && file.type != "image/jpeg" && file.type != "image/png") {
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        let preSignedUrl: string;
        let profilePhotoKey: string;
        let newtoken: string;
        let picture_name = file.name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');

        this.profileService.updateImageProfile(picture_name, file.type).subscribe(
          response => {
          if (response.code === 200) {
            profilePhotoKey = response.key;
            preSignedUrl = response.url;
            newtoken = response.newtoken;

            this.profileService.uploadProfileImage(preSignedUrl, file.type, file).subscribe(response => {
              this.imgProfile = this.storageUrl + profilePhotoKey;
              localStorage.setItem("token", newtoken);

              this.toolBarService.changeUserMenuPhoto(profilePhotoKey);
            });
          }
        });
      };
    }
  }

}
