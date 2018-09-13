pipeline {
    agent {
      node {
          label 'ansible'
          customWorkspace '/home/ec2-user'
      }
    }
    stages {

        stage('Checkout') {
            steps{
                echo 'Getting source code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                parallel(
                    "Frontend": {
                         echo 'Installing Dependencies...'    
                    },
                    "Backend": {
                         echo 'Installing Dependencies...'
                         sh 'npm install'
                    }
                )
            }
        }

        stage('Test') {
            steps {
                parallel(
                    "Unit testing": {
                        echo 'Executing Unit tests...'
                        sh 'npm run test:unit'
                    },
                    "Integration testing": {
                        echo 'Executing Integration tests...'
                    },
                    "E2E testing": {
                        echo 'Executing Integration tests...'
                    }
                )
            }
        }
    }
}
