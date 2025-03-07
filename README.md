# CoolGoat
Football betting system based on broker data allowing users to buy and sell bonds as well as receive rewards on successful bets. 


This project is available at https://web.coolgoat4444.me/ and was completed by me (Uladzimir Treihis) and my very talanted teammates 

- Felipe Vidal Fuentes 
- Martin Novoa
- Diego Lizama Barria

The original repository remains private for security purposes. `This repository serves to showcase our successful and independent work`. We built this project from complete scratch and used only publicly available resources to educate ourselves about the technologies we have used. In my case, `I am proud to master AWS stack, PostgreSQL, GitHub Actions and Docker as part of this project` - the stack that I have never ever worked with before and neither did my teammates.

## My specific contribution includes:

### Backend
- Implemented `broker microservice` allowing to communicate with external brokers and our App (MQTT posts and gets) to successfully receive football updates, communicate purchases and bond reservations, process payments based on results. 
- Implemented `90% of API logic` (Auth, Bond Operations, Wallet operations) using the layered architecture: Db -> Model -> Controller -> Route.
- `Integrated WebPay banking services`, enabling secure debit card transactions.
- Planned and modelled the `database schema` for all operations.
- Set up `PostgreSQL` and implemented several `scripts for easy testing`. 
- Set up `database migrations` with Knex.

### Frontend
- Integrated `WebPay banking services with a React-based frontend`.
- Implemented several `components related to financial operations` (Wallet and Webpay logic, Bonds status viewing page).

### DevOps
- Set up `containerization` using Dockerfile and docker-compose, provided different versions for local and remote configurations. 
- `Deployed the backend to AWS EC2`, integrated with `API Gateway`, `Authorization and Authentication Lambdas`.
- Participated in crafting `CI Pipeline for backend`. 

### Documentation
- Participated in creating `developer's guide` and `UML diagram`.
- Created and maintained `API documentation for Postman`. 

### Leadership
  I am proud to have been approached for advice on many occasions. I was given the privillage to allocate tasks using GitHub Projects based on my understanding of my teammates interests and skills. I was happy to serve as the bridge between backend, frontend and AWS cloud communication, ensuring any update on either side is delivered and understood. 

