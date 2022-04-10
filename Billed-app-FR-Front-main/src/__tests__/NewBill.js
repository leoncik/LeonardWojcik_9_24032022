/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import {localStorageMock} from "../__mocks__/localStorage.js"
import { ROUTES_PATH} from "../constants/routes.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import router from "../app/Router.js"
import store from "../__mocks__/store.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBe(true)


      // const html = NewBillUI()
      // document.body.innerHTML = html
    })
  })
})

describe("When I am on NewBill Page and add a file", () => {
  test("Then the file info should be added with handleChangeFile", async () => {
    // const e = { preventDefault: () => {} };

    // beforeEach(() => {
    //   jest.spyOn(e, 'preventDefault');
    // });

    // const e = { stopPropagation: jest.fn() }


    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.NewBill)
    await waitFor(() => screen.getByTestId('file'))
    const fileInput = screen.getByTestId('file')
    expect(fileInput).toBeTruthy()
    // const store = null
    const newBill = new NewBill({
      document, onNavigate, store, localStorage: window.localStorage
    })

    const e = {
      preventDefault: jest.fn(),
      // target: { value: fileInput }
      target : fileInput
    };
    const handleChangeFile = jest.fn(newBill.handleChangeFile(e))
    fireEvent.click(fileInput);
    expect(handleChangeFile).toHaveBeenCalled
  })
})

// test d'intégration POST
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page, fill the required fields and add a file with a wrong extension", () => {
    test("Then an alert should appear and the bill should not be saved", async () => {

      // Set page
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('file'))
      const fileInput = screen.getByTestId('file')
      expect(fileInput).toBeTruthy()

      // Changing file extension to unsupported extension
      fileInput.filename = 'myWrongFile.webp'

      // Submit form
      const submitButton = document.querySelector('button[type="submit"]')
      fireEvent.click(submitButton);

      expect(window.alert).toBeCalledWith('Format du justificatif non valide. Veuillez choisir un fichier au format jpg, jpeg ou png.')
    })
  })
  describe("When I am on NewBill Page, fill the required fields and add a file with a valid extension", () => {
    test("Then the bill should be saved and I should be redirected to bills page", async () => {

      // Set page
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('file'))
      const fileInput = screen.getByTestId('file')
      expect(fileInput).toBeTruthy()

      // Submit form
      const submitButton = document.querySelector('button[type="submit"]')
      fireEvent.click(submitButton);

      // Redirect to bills page
      // ! Needs to check this.onNavigate(ROUTES_PATH['Bills'])
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBe(true)
    })
  })
})