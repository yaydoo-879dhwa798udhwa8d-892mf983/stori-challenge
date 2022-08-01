
![alt text](https://www.storicard.com/_next/static/media/logo.9a85efb3.svg)

This is my challenge solution for Stori Challenge

The program was coded with NodeJs/Javascript/Typescript. It can read file from src/data as `youremail.csv` and create account row in Account table, perhaps it can copy all transactions from csv file to Transaction table with Account relationship.
## Features
- Insert Accounts into Database
- Insert Transactions into Database
- Read CSV File from `src/data`
- Write transaction data into csv file in `src/data` 
- Calculate
  - Account Total Balance
  - Number of transactions grouped by Month
  - Average Credit and Debit Amount per Month
- Send test email by `ethereal.email` to account email


### Enviroment file
Create environment file and copy variables from .env.example
```Shell
touch .env
```
OR

Use existing enviroment example
```Shell
mv .env.example .env
```

## Execute With Docker Compose

Example .env file
```Shell
DB_HOST=docker.for.mac.host.internal
DB_PORT=5432
DB_USERNAME=username
DB_PASSWORD=password
DB_NAME=default_database
```

Install Docker | Docker-compose

```Shell
https://docs.docker.com/engine/install/
```

Build project docker mages
```
docker-compose up -d --build
```

Execute flow(You could set your email)
```Shell
docker run -w /usr/src/app --network=host -it stori_app  npm run start siscom.grana@gmail.com
```


Read file read to watch Account transactions.
You need to modify csv name with your email.csv.
After this you can get the email url by `Preview URL` in command line
```Shell
docker run -w /usr/src/app --network=host -it stori_app  more src/data/siscom.grana@gmail.com.csv
```

Execute Database command line 
```Shell
docker exec -it database psql --dbname=default_database --username=username 
```




Query to watch Account transactions
```sql
select * from transaction tx where tx."accountId" = (select id from account where email='siscom.grana@gmail.com');
```


Exit database console
```Shell
\q
```

## Execute with Local enviroment

Example .env file
```Shell
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=username
DB_PASSWORD=password
DB_NAME=default_database
```

Install Docker | Docker-compose

```Shell
https://docs.docker.com/engine/install/
```

Build project docker mages
```
docker-compose up -d --build
```

Install dependencies
```Shell
npm i 
```

Install dependencies
```Shell
npm run start youremail
```

## To shutdown Docker Compose 

```Shell
docker-compose down
 ```