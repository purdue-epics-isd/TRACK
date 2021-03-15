from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
import os
import time
import random

driver = webdriver.Safari()
driver.get("https://track-dev-build.herokuapp.com/")
time.sleep(1)
driver.maximize_window()
time.sleep(3)

# LOG IN
logInButton = driver.find_element_by_id("SignIn")
logInButton.click()
time.sleep(3)

pageList = driver.window_handles
if(pageList[0] == driver.current_window_handle):
    driver.switch_to.window(pageList[1])
else:
    driver.switch_to.window(pageList[0])

emailInput = driver.find_element_by_xpath('//*[@id="i0116"]')
emailInput.send_keys("zimmeras@purdue.edu")
emailInputButton = driver.find_element_by_xpath('//*[@id="idSIButton9"]')
emailInputButton.click()
time.sleep(3)

passwordInput = driver.find_element_by_id("i0118")
passwordInput.send_keys("pwpzeber44")
passwordInputButton = driver.find_element_by_id("idSIButton9")
passwordInputButton.click()
time.sleep(3)

staySignedInButton = driver.find_element_by_xpath('//*[@id="idSIButton9"]')
staySignedInButton.click()
time.sleep(5)

if(pageList[0] == driver.current_window_handle):
    driver.switch_to.window(pageList[1])
else:
    driver.switch_to.window(pageList[0])

# MAKE SURE ON HOME PAGE
navBarLogo = driver.find_element_by_xpath('/html/body/div/header/nav/a')
navBarLogo.click()
time.sleep(3)

# CREATING A STUDENT
createNewStudentButton = driver.find_element_by_xpath('/html/body/div/div[1]/div[2]/a/button')
createNewStudentButton.click()
time.sleep(3)

firstName = driver.find_element_by_name("firstname")
firstName.send_keys("QA")
lastName = driver.find_element_by_xpath('/html/body/div/main/div[2]/div[1]/form/input[2]')
lastName.send_keys("Tester")
email = driver.find_element_by_xpath('/html/body/div/main/div[2]/div[1]/form/input[3]')
email.send_keys("qatester@purdue.edu")
dob = driver.find_element_by_xpath('/html/body/div/main/div[2]/div[2]/input')
dob.send_keys("07/30/2002")
gradeLevel = Select(driver.find_element_by_xpath('/html/body/div/main/div[2]/div[2]/select'))
gradeLevel.select_by_value("5")
submitStudentButton = driver.find_element_by_xpath('/html/body/div/main/div[2]/div[2]/div/input[1]')
submitStudentButton.click()
time.sleep(3)

# CREATING A GOAL
QAstudent = driver.find_element_by_xpath('//*[@id="studentBox"]/a[1]')
QAstudent.click()
time.sleep(3)

createNewGoalButton = driver.find_element_by_xpath('//*[@id="goalsBox"]/a')
createNewGoalButton.click()
time.sleep(3)

goalTitle = driver.find_element_by_xpath('//*[@id="name"]')
goalTitle.send_keys("QA testing goal")
goalDescription = driver.find_element_by_xpath('//*[@id="description"]')
goalDescription.send_keys("I am using automated QA testing to test this goal.")
goalStartDate = driver.find_element_by_xpath('//*[@id="startDate"]')
goalStartDate.send_keys("02/18/2021")
goalEndDate = driver.find_element_by_xpath('//*[@id="endDate"]')
goalEndDate.send_keys("05/08/2021")
goalType = driver.find_element_by_xpath('//*[@id="regForm"]/div[3]/div[1]/label')
goalType.click()
goalMethodOfCollection =driver.find_element_by_xpath('//*[@id="count"]')
goalMethodOfCollection.click()
goalSubmitButton = driver.find_element_by_xpath('//*[@id="nextBtn"]')
goalSubmitButton.click()
time.sleep(3)

# ADD GOAL OCCURRENCE
goal = driver.find_element_by_xpath('//*[@id="goalCard"]/div')
goal.click()
time.sleep(3)

addOccurrenceButton = driver.find_element_by_xpath('//*[@id="occurrencesButton"]')
for x in range(1, random.randint(2,10)):
    addOccurrenceButton.click()
descriptionBox = driver.find_element_by_xpath('//*[@id="exampleTextarea"]')
descriptionBox.send_keys("On this occurrence, it happened some amount of times")
goalOccurrenceSubmit = driver.find_element_by_xpath('//*[@id="submitForm"]/input')
goalOccurrenceSubmit.click()
time.sleep(3)

backToClassPage = driver.find_element_by_xpath('/html/body/div/main/div[1]/a')
backToClassPage.click()
time.sleep(3)

# EXITING QA TESTING


driver.quit()