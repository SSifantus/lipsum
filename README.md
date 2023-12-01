## Lipsum
This application manages beat sheets for video creators. It is built with Next.js, Prisma, PostgreSQL, and Next-Auth 
and is hosted on Vercel.

[View Live Application](https://beatmanager.vercel.app/)

## Local Development

To run this application locally, run the following from the root directory:

```bash
# intall dependencies
yarn install
# run the development server
yarn dev
```

To use the live application, create credentials by visiting:
[https://beatmanager.vercel.app/register](https://beatmanager.vercel.app/register)


### Data Model

This application is based on the following model:

#### BeatSheet

| Field Name | Type   | Description                         |
|------------|--------|-------------------------------------|
| id         | uuid   | The BeatSheet unique identifier     |
| title      | string | The title of the BeatSheet          |
| acts       | Act[]  | Associated Acts                     |
| createdAt   | string | Timestamp of BeatSheet creation     |
| updatedAt   | string | Timestamp of last BeatSheet update  |



#### Act

| Field Name  | Type   | Description                  |
|-------------|--------|------------------------------|
| id          | uuid   | The Act unique identifier    |
| description | string | The description of the Act   |
| createdAt   | string | Timestamp of Act creation    |
| updatedAt   | string | Timestamp of last Act update |
| beats       | Beat[] | Associated Beats             |


#### Beat

| Field Name  | Type   | Description                                 |
|-------------|--------|---------------------------------------------|
| id          | uuid   | The Beat unique identifier                  |
| createdAt   | string | Timestamp of Beat creation                  |
| updatedAt   | string | Timestamp of last Beat update               |
| cameraAngle | string | Description of the camera angle for the act |
| description | string | The description of the Beat                 |
| duration    | string | The duration of the Beat                    | |
| title       | string | The title of the Beat                       |

