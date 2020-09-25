Feature: Selenium tutorial
Scenario Outline: Finding some cheese
   Given I am on the Google search page
   When I search for "<string>"
   Then the page title should start with "<string>"

    Examples:
    | string           | answer |
    | cheese         | TGIF   |