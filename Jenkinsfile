pipeline {
    agent any

    environment {
        // Define your Docker image name and tag
        IMAGE_NAME = 'pantry-management-app'
        IMAGE_TAG = "build-${env.BUILD_ID}"
        CONTAINER_NAME = 'pantry-management-app-container'
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins automatically checks out the configured Git branch
                echo "Checking out from GitHub..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image: ${IMAGE_NAME}:${IMAGE_TAG}"
                    // Build the React app inside Docker multi-stage process
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    echo "Stopping and removing existing container (if any)..."
                    // Catch errors in case the container doesn't exist on the first deployment
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                        sh "docker stop ${CONTAINER_NAME}"
                        sh "docker rm ${CONTAINER_NAME}"
                    }
                }
            }
        }

        stage('Deploy New Container') {
            steps {
                script {
                    echo "Deploying the new container..."
                    // Run the container binding host port 8080 to container port 80
                    sh "docker run -d -p 8080:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}:latest"
                }
            }
        }
    }
    
    post {
        always {
            echo "CI/CD Pipeline Completed."
        }
        success {
            echo "Application successfully deployed!"
        }
        failure {
            echo "Pipeline Failed. Please review the logs."
        }
    }
}
