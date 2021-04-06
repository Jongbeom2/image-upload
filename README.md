# Image 업로드 프로세스

1. 클라이언트에서 백앤드에 이미지 업로드를 위한 pre-signed url을 요청함.
2. 백앤드에서 pre-signed url을 클라이언트에 보냄.
3. 클라이언트에서 pre-signed url을 이용하여 이미지를 업로드함. 이때 이미지를 aws 원본 bucket에 저장함.
4. 이미지를 업로듷면 lambda 함수가 트리거로 인해 실행됨. 저장한 이미지를 resize하고 aws resize bucket에 저장함.
5. 클라이언트에서 원본 url이나 resized 된 이미지의 url을 사용함.

# AWS pre-signed url을 이용한 Image Upload

### 권한 설정

- 사용할 s3 bucket의 권한을 가진 유저를 생성 함. 백앤드에서는 이때 생성한 유저의 access key와 secret access key를 사용함.
- s3 bucket 권한의 버킷 정책에서 클라이언트 도메인에서만 get Object 할 수 있도록 설정함.
- s3 bucket 권한의 cors에서 클라이언트 도메인에서만 put할 수 있도록 설정함.

### 백엔드에서 pre-signed url 생성 코드 작성

참고자료

[Fetch file from AWS S3 using pre-signed url and store it into local system.](https://medium.com/@prateekgawarle183/fetch-file-from-aws-s3-using-pre-signed-url-and-store-it-into-local-system-879194bfdcf4)

### 클라이언트에서 pre-signed url을 이용하여 파일 업로드 코드 작성 파일 업로드 코드 작성

참고자료

[](https://aws.amazon.com/ko/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/)

# AWS Lambda를 이용한 Image Resizing

원래 정석은 이러함.
1. Lambda 개발 환경 로컬에 세팅
2. 개발 및 테스트
3. 소스 코드를 업로드

근데 image resize 기능만 구현할 예정이라 예시 코드를 그대로 사용하여 업로드하였음.

### Lambda 개념

참고자료

[0.1초 동안 컴퓨터를 빌려보자 - AWS Lambda](https://www.youtube.com/watch?v=t8sjTFM_tfE)

### 로컬 lambda 개발 환경 세팅

참고자료

[Locally Debug Lambda Functions with the AWS Toolkit for VS Code](https://www.youtube.com/watch?v=FINV-VmCXms)

### Lambda에 Resize 코드 작성후 업로드 (.zip으로 업로드하는 경우 런타임 환경의 handler 앞에 폴더 이름을 붙여야함)

참고자료

[Automatic Resizing of Uploaded Images - AWS, S3 and Lambda tutorial](https://www.youtube.com/watch?v=cq-FeN48SCw)

### Resize 한 이미지를 저장할 bucket을 생성

- 트리거를 쓰면 재귀적으로 이미지를 계속 resize하고 저장할 위험이 있어서 따로 저장함.

### 권한 설정

- 원본 bucket에서 Lambda 함수의 읽기 권한을 허용함.
- resized bucket에서 Lambda 함수의 쓰기 권한을 허용함.
- 권한 설정 참고 자료

[Lambda에서 S3로 파일 업로드 시 발생하는 교차 계정 403 오류 해결](https://aws.amazon.com/ko/premiumsupport/knowledge-center/access-denied-lambda-s3-bucket/)

### 트리거 설정

- 원본 버킷의 특정 경로에 업로드가 발생하면 실행함.
