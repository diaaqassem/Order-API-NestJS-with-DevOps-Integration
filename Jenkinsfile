def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]
pipeline{
    agent{
        label "Master"
    }
    tools{
        nodejs "Nodejs"
        docker "Docker"
    }
    environment{
        DB_URI = 'mongodb://localhost/orders-api-v5'
        JWT_SECRET = "jwt_secret"
        JWT_EXPIRES_IN = 3600
        MAIL_HOST= 'smtp.ethereal.email'
        MAIL_USER= 'autumn.kohler90@ethereal.email'
        MAIL_PASSWORD="s5wZHwNG4gePu7cRqf"
        MAIL_PORT=587
        MAIL_USE_TLS=T
    }
    stages{
        stage("Fetch Code from VCS"){
            steps{
                echo "======== Fetching ========"
                git url: "https://github.com/diaaqassem/Order-API-NestJS-with-DevOps-Integration.git", branch: "main"
            }
            post{
                success{
                    echo "========Fetched Successfully========"
                }
                failure{
                    echo "========Fetching Failed========"
                }
            }
        }
        stage("Build App Image"){
            steps{
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}", "./")
                }
            
            }
            post{
                success{
                    echo "========Built Successfully========"
                }
                failure{
                    echo "========Building Failed========"
                }
            }
        }
        stage('Upload App Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                    dockerImage.push("${BUILD_NUMBER}")
                    dockerImage.push("latest")
                    }
                }   
            }
            post{
                success{
                    echo "========Upload Successfully========"
                }
                failure{
                    echo "========Upload Failed========"
                }
            }
        }
        stage('Cleanup') {
            steps {
                script {
                    sh "docker rmi ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    sh "docker rmi ${DOCKER_IMAGE}:latest"
                }
            }
            post{
                success{
                    echo "========Cleanup Successfully========"
                }
                failure{
                    echo "========Cleanup Failed========"
                }
            }
        }
    }
    post{
        always {
            echo 'Slack Notifications.'
            slackSend channel: '#devops',
                color: COLOR_MAP[currentBuild.currentResult],
                message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n More info at: ${env.BUILD_URL}"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}