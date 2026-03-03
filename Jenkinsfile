pipeline {
  agent any

  environment {
    APP_NAME = "cicd-demo"
    KUBECONFIG = "/var/lib/jenkins/.kube/config"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build image inside Minikube Docker') {
      steps {
        sh '''
          set -eux
          eval $(minikube -p minikube docker-env)
          docker build -t ${APP_NAME}:${BUILD_NUMBER} .
          docker tag ${APP_NAME}:${BUILD_NUMBER} ${APP_NAME}:latest
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          set -eux
          kubectl apply -f k8s/deploy.yaml
          kubectl rollout status deployment/${APP_NAME} --timeout=120s
        '''
      }
    }
  }
}
