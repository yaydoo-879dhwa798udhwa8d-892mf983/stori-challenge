# TODO TITLE

This is my challenge solution for Stori Challenge for the position of Tech Lead.

The program was coded with NodeJs/Javascript/Typescript. It can read file from src/data as `youremail.csv` and create acccount row in Account table, perhaps it can copy all transactions from csv file to Transaction table with Account relationship.
## Features
- Insert Account row in Database
- Insert Transactions to Database
- Read CSV File from `src/data`
- Calculate
- - Account Total Balance
- - Number of transactions grouped by Month
- - Average Credit and Debit Amount per year




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


Read file read to watch User transactions.
You need to modify csv name with your email.csv
```Shell
docker run -w /usr/src/app --network=host -it stori_app  more src/data/siscom.grana@gmail.com.csv
```

Execute Database command line
```Shell
docker exec -it database psql --dbname=default_database --username=username 
```

Query to watch User transactions
```sql
select * from transaction tx where tx."accountId" = (select id from account where email='siscom.grana@gmail.com');
```


Exit Database
```Shell
\q
```

## Execute with Local enviroment

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