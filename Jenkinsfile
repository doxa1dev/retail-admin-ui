pipeline {
  agent any

  options {
    disableConcurrentBuilds()
  }

  tools {
      // docker "jenkins-docker"
      nodejs "node10"
  }

  environment {
    HOME = '.'
    DOMAIN_NAME = 'doxa-holdings.com'
    DATETIME_TAG = (java.time.LocalDateTime.now()).format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
    SLACK_CHANNEL = '#jenkins-retail'
    EC2_DEPLOYMENT_FOLDER = 'retail-admin-ui'

  }

  stages {
    stage('Set variables') {
      parallel {
        stage('Set variables for STAGE') {
          steps {
            script {
              branchDelimitted = env.BRANCH_NAME.split('/')
              stageName = branchDelimitted[1].trim()

              switch (stageName) {
                case 'stag2':
                    DISTRIBUTION_PATH = "dist/doxa-direct-sales"
                    S3_BUCKET = "stag2-direct-sales.${env.DOMAIN_NAME}"
                    EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-STAG2'
                    NG_CONFIG = 'stag2'
                    break
                case 'stag2a':
                  DISTRIBUTION_PATH = "dist/doxa-direct-sales"
                  S3_BUCKET = "stag2a-direct-sales.${env.DOMAIN_NAME}"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-STAG2A'
                  NG_CONFIG = 'stag2a'
                  break
                case 'stag2b':
                  DISTRIBUTION_PATH = "dist/doxa-direct-sales"
                  S3_BUCKET = "stag2b-direct-sales.${env.DOMAIN_NAME}"
                  NG_CONFIG = 'stag2b'
                  break
                case 'uat':
                  DISTRIBUTION_PATH = "dist/doxa-direct-sales"
                  S3_BUCKET = "uat-direct-sales.${env.DOMAIN_NAME}"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-UAT'
                  NG_CONFIG = 'uat'
                  break
                case 'prod':
                  DISTRIBUTION_PATH = "dist/doxa-direct-sales"
                  S3_BUCKET = "direct-sales.${env.DOMAIN_NAME}"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-PROD'
                  NG_CONFIG = 'prod'
                  break
              }
            }
          }
        }

        stage('Set notification info') {
          steps {
              script {
                NOTIFICATION_INFORMATION = "---------\n BUILD_TAG ${env.BUILD_TAG} \n GIT_URL ${env.GIT_URL} \n GIT_BRANCH ${env.GIT_BRANCH} \n GIT_COMMIT ${env.GIT_COMMIT} \n DATETIME_TAG ${DATETIME_TAG} \n ---------"
              }
          }
        }
      }
    }

    stage('Send START Notification') {
      steps {
        slackSend(color: '#FFFF00', channel: "${SLACK_CHANNEL}", message: "\n *** START TO DEPLOY on *** \n ${NOTIFICATION_INFORMATION}")
      }
    }

    stage('Print variables'){
      steps {
        echo "Jenkins Information ---- EXECUTOR_NUMBER ${env.EXECUTOR_NUMBER}"
        echo "Git Information ---- GIT_COMMIT ${env.GIT_COMMIT} --- GIT_URL ${env.GIT_URL} --- GIT_BRANCH ${env.GIT_BRANCH}"
        echo "Build Information ---- DISTRIBUTION_PATH ${DISTRIBUTION_PATH} --- S3_BUCKET ${S3_BUCKET} --- NG_CONFIG ${NG_CONFIG}"
        echo "Workspace ---- WORKSPACE ${WORKSPACE}"
      }
    }

    stage('Install Packages') {
      steps {
        sh 'npm version'
        sh 'npm install @angular/cli'
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        sh "node --max_old_space_size=4096 node_modules/.bin/ng build -c ${NG_CONFIG}"
      }
    }
    stage('Deploy to EC2') {
      steps{
        slackSend(channel: "${SLACK_CHANNEL}", message: "Copying built code to EC2", sendAsText: true)
        
        sshPublisher(publishers: [sshPublisherDesc(configName: "${EC2_PUBLISH_OVER_SSH_SERVER_NAME}", transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: "rm -rf ${EC2_DEPLOYMENT_FOLDER}; exit", execTimeout: 30000)], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true, usePty: true)])

        sshPublisher(publishers: [sshPublisherDesc(configName: "${EC2_PUBLISH_OVER_SSH_SERVER_NAME}", transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '', execTimeout: 30000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "./${EC2_DEPLOYMENT_FOLDER}", remoteDirectorySDF: false, removePrefix: '', sourceFiles: "**/*")], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true, usePty: true)])

      }
    }

  }

  post {
    always {
      /* Clean Jenkins Workspace */
      dir('..') {
        sh "rm -rf ${env.WORKSPACE}/*"
      }

      /* Use slackNotifier.groovy from shared library and provide current build result as parameter */

      script {
        COLOR_MAP = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'danger', 'ABORTED': 'danger']
        BUILD_FAILURE_CAUSE='=='
        if (currentBuild.currentResult=='FAILURE') {
            BUILD_FAILURE_CAUSE = currentBuild.getBuildCauses()
        }
        slackSend(color: COLOR_MAP[currentBuild.currentResult], channel: "${SLACK_CHANNEL}", message: "END DEPLOYMENT with status ${currentBuild.currentResult} \n ${BUILD_FAILURE_CAUSE} \n ${NOTIFICATION_INFORMATION}")
      }
    }
  }
}
