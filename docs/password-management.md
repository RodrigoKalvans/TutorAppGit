# Password Storage

## Introduction

In order to bring more security to the password management and storage extra features and new approach was chosen. This approach was recommended by OWASP Cheat Sheet Series - Password Storage Cheat Sheet (link: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). In order to bring the security to the next level, it was decided to firstly hash the passwords and then implement so-called peppering strategy.

## Hashing

To hash passwords the tool called Argon2 was used, as I was suggested to be the most secure hashing tool.

## Peppering strategy

After the password was hashed the AES encryption is implemented on the hashed password and then it is stored in the database.