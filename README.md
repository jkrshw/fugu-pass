fugu-pass
=========

Google App script for storing passwords in a spreadsheet encrypted with blowfish (from [Barnes Storming](http://barnes-storming.blogspot.co.nz/2011/08/encrypting-data-in-google-documents.html) using PBKDF2

The script requires a Google account and all information is stored within your account's properties and a spreadsheet called 'EncryptedPasswords'.

##Usage

Before using FuguPass you need to grant the script privileges. Unfortunately there is no nice way to do this from the app itself, instead you need to open the script in [edit mode](https://script.google.com/d/1l23aUzJBCfy5QZAxtZGiXyy3XOv0JtDoSrjFhzlEh7R4qaz-XoDuLoKk/edit) and run it by selecting a function (e.g. doGet) and clicking the run icon. You'll be prompted to grant the required privileges to the script and then you can access the [web app](https://script.google.com/macros/s/AKfycbwNHyA_BuHR9JcOUCAz8hgnFZ75x57r5zp9Bo_mVS2Rf6uAIOaO/exec).

![picture](/images/editmode.png)

On first run enter a master key that will be used for encryption. This input field is not masked so you can check that the value you entered is correct. Clicking 'Save' will generate the derived key used for encryption and create the spreadsheet used to store the encrypted passwords.

On subsequent runs you will be prompted to enter the master key. This time the input field is masked and the value entered is checked to make sure it is the same as the initial master key. If you lose your master key there is zero chance of recovering it. So don't do that.

![picture](/images/unlocking.png)

After unlocking FuguPass there are two input boxes and two buttons. To save a new password type in the name you want to associate with the password and the password plaintext and click save. You will be prevented from overwriting any existing passwords with the same name.

To retrieve a password type in the name and click get. If the password exists it will be displayed in the password text field unmasked.

![picture](/images/password.png)

##PBKDF2

This [blog post](http://jessek-dev.blogspot.co.nz/2013/02/fugupass-encryption-scheme.html) describes the PBKDF2 implementation.