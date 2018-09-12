pipeline {
    agent {
        docker {
            image 'node:4.4.7' 
            args '-p 4999:4010 -u 0:0' 
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
                echo 'Installing Dependencies...'
                sh 'npm i'
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
                    }
                )
            }
        }
    }
}
