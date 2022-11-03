node {
    stage('Clone repository') {
        checkout scm
    }

    try {
        stage('Run tests') {
            withCredentials([
                    usernamePassword(credentialsId: 'SAMPLE_APP_CREDENTIALS', passwordVariable: 'ADMIN_PASSWORD', usernameVariable: 'ADMIN_USERNAME'),
            ]) {
                docker.image('mcr.microsoft.com/playwright:v1.27.0-focal')
                        .inside('--ipc=host --init ' +
                                '-e "PLATFORM_URL=https://your-platform-url.davra.com" ' +
                                '-e "BASE_URL=https://your-app-url.apps.davra.com/" ' +
                                '-e "AUTH_METHOD=OAuth"') { c ->
                            sh 'npm install'
                            sh 'npm test'
                        }
            }
        }
    } finally {
        stage('Archive report') {
            sh 'tar -zcvf report.tar.gz playwright-report'
            archiveArtifacts artifacts: 'report.tar.gz', followSymlinks: false
        }
    }
}