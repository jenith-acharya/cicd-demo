pipeline {
  agent any

  environment {
    IMAGE = "jenithacharya/cicd-demo"
    KUBECONFIG = "/var/lib/jenkins/.kube/config"
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Build') {
      steps {
        sh 'docker build -t $IMAGE:$BUILD_NUMBER .'
        sh 'docker tag $IMAGE:$BUILD_NUMBER $IMAGE:latest'
      }
    }

    stage('Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker push $IMAGE:$BUILD_NUMBER
            docker push $IMAGE:latest
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          kubectl apply -f k8s/deploy.yaml
          kubectl set image deployment/cicd-demo app=$IMAGE:$BUILD_NUMBER
          kubectl rollout status deployment/cicd-demo --timeout=120s
        '''
      }
    }
  }
}
