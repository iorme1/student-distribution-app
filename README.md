# Student Distribution
![sample class data](https://user-images.githubusercontent.com/28276414/59533769-50eb7d80-8ea1-11e9-8ddb-fb27258d0988.png)

## Purpose
An application that makes k-5 teachers lives easier. The application aims to simplify the entire process by which teacher's decide which students will be placed into next year's classrooms.

## The Application Details
The application will obtain the information it needs from the user by presenting a form with certain inputs such as “number of classrooms”, “max capacity of classrooms”, and the “metric spread factor”. The "metric spread factor" is used to fill the classrooms appropriately by achieving an even spread of students with respect to the user-chosen "metric". For example, student's could potentially be ranked "1-5" in a metric called "Behavior". The application will make sure that all of the classrooms will have an even distribution of students to achieve the same score in this metric. After filling out that information, the user simply uploads an excel file containing their student metric data. The application then reads the file and immediately displays each classroom. The classrooms will display all of their respective student names, total scores in each metric, and achieve an even spread of the "metric spread factor". From there, teachers often find that more specific changes need to be made on a case by case basis (such as two kids that can't be in the same classroom together or achieving a better male-to-female ratio in all classes). So at this point, the user can drag and swap students from one classroom to another.The total score in all metrics for each classroom will update in real time after a swap has been made. The total metric scores can be seen at the bottom of each classroom table. These metric scores can be clicked on to either visually highlight these students or simply display the individual student score in this metric next to each student name. User's can create accounts and save their data if they wish to come back to it later for further adjustments. Demo video will be linked
in this README as a reference.

## Technologies Used
 -Bootstrap 4
 -SheetJS excel parser library
 -Animate.css library for animations
 -jQuery
 -SweetAlert2


## Application Setup
 -Fork/clone this repository. Node is not setup on this application, so
 at this point I have been using my TextEditor's Live Server feature for development (I use Atom).

 -Remember to set URL's to localhost for all fetch requests to the backend API when working in development. Navigate to scripts folder and you will find the relevant urls to switch to localhost in the following files:
   -login.js
   -register.js
   -retrieve-classes.js
   -save-classes.js

 -In order to play around with this application, an excel file is needed
 with student names and their scores/values in metric columns. While the excel file requirements are flexible for number ranking metrics, at this point there are a few requirements for formatting other types of data. There must be a "name" column that contains the student's first and last name. A "sex" column that must have values of either "m" for male or "f" for female. Binary metrics (meaning the student either HAS this attribute or does NOT HAVE this attribute must have values of either "yes" or "no"). Ranking metric columns (1-5, 1-10, etc) can be named anything you choose and ranked with any number value you choose. Below is an example excel file with proper
 formatting.

 <img width="761" alt="sample excel" src="https://user-images.githubusercontent.com/28276414/59538156-a9287c80-8ead-11e9-869b-7b593027e763.png">


-Go to https://github.com/iorme1/student-distribution-api and read setup
guide for setting up backend locally.
