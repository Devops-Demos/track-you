pipeline {
    agent any
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
                         sh 'sudo npm i'
                    }
                )
            }
        }

        stage('Test') {
            steps {
                parallel(
                    "Unit testing": {
                        echo 'Executing Unit tests...'
                        sh 'sudo npm run test:unit'
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
