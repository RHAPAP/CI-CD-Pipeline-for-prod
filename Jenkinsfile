pipeline {
    agent any
    
    tools {
        jdk 'jdk21'
        maven 'maven'
    }
    
    environment {
        SCANNER_HOME= tool 'sonar-scanner'
        TRIVY_CACHE_DIR = '/var/lib/jenkins/.trivy-cache'
    }

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', credentialsId: 'git-cred', url: 'https://github.com/RHAPAP/CI-CD-Pipeline-for-prod.git'
            }
        }
        
        stage('Compile') {
            steps {
                sh "mvn compile"
            }
        }
        
        stage('Test') {
            steps {
                sh "mvn test"
            }
        }
        
        stage('Trivy FS Scan') {
            steps {
                sh "trivy fs --timeout 15m0s --format table -o fs.html ."
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=CI-CDpipelineforprod -Dsonar.projectKey=CI-CDpipelineforprod \
                      -Dsonar.java.binaries=target '''
                }   
            }
        }
        
        stage('Build') {
            steps {
                sh "mvn package"
            }
        }
        
        stage('Publish Artifacts') {
            steps {
                withMaven(globalMavenSettingsConfig: 'maven-settings', jdk: 'jdk21', maven: 'maven', traceability: true) {
                    sh "mvn deploy"
                }
            }
        }
        
        stage('Docker Build & Tag') {
            steps {
                script {
                withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {

                sh "docker build -t rrhapap/ci-cd-pipeline-for-prod:latest ."    
                }
                }
            }
        }
        
        stage('Trivy Image Scan') {
            steps {
                sh "trivy image --timeout 15m0s --format table -o image.html rrhapap/ci-cd-pipeline-for-prod:latest"
            }
        }
        
        stage('Docker Push Image') {
            steps {
                script {
                withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {

                sh "docker push rrhapap/ci-cd-pipeline-for-prod:latest"    
                }
                }
            }
        }
        
    }
}
