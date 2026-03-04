pipeline {
  agent any

  environment {
    IMAGE = "jenithacharya/cicd-demo"
    APP_NAME = "cicd-demo"
    KUBECONFIG = "/var/lib/jenkins/.kube/config"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('SonarQube Scan') {
      steps {
        withSonarQubeEnv('sonar') {
          sh '''
            set -eux
            sonar-scanner
          '''
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Build Image') {
      steps {
        sh '''
          set -eux
          docker build -t $IMAGE:$BUILD_NUMBER .
        '''
      }
    }

    stage('Trivy Scan Image') {
      steps {
        sh '''
          set -eux
          trivy image --no-progress --severity HIGH,CRITICAL --exit-code 1 $IMAGE:$BUILD_NUMBER
        '''
      }
    }

    stage('Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            set -eux
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker push $IMAGE:$BUILD_NUMBER
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          set -eux
          kubectl apply -f k8s/deploy.yaml
          kubectl set image deployment/$APP_NAME app=$IMAGE:$BUILD_NUMBER
          kubectl rollout status deployment/$APP_NAME --timeout=180s
        '''
      }
    }
  }
}
