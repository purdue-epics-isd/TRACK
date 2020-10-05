Feature: Starting testing
Scenario Outline: login to website
   Given I am on the TRACK login page
   When I click login
   Then the page title should be "<string>"

    Examples:
    | string           | answer |
    | Login         | TGIF   |