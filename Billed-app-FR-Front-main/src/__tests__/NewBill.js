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
    // Todo | add statement : expect added file name to match input value
  })
})

// test d'intégration POST
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page, add a file with a wrong extension and try to submit form", () => {
    test.only("Then an alert should appear and the bill should not be saved", async () => {

      // ! WARNING, TEST.ONLY IS ACTIVE !!!
      // ! Bug : File value is null

      // Define fetch
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({fileUrl: 'https://localhost:1829/images/test.jpg', fileName: 'totoro', billId: '1234'})
      }));

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
      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
      const e = {
        preventDefault: jest.fn(),
        // target : fileInput
        target: { value: 'chucknorris.png' }
      };
      const handleChangeFile = jest.fn(newBill.handleChangeFile(e))
      fileInput.addEventListener('change', handleChangeFile)
      // ! Test without handleChangeFile
      // fireEvent.change(fileInput, {
      //   target: {
      //     files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
      //     // ! can't change value here…
      //     // value: 'chucknorris.png'
      //   },
      // })
      // ! Test with handleChangeFile
      fireEvent.change(fileInput)
      expect(fileInput.value).toBe('chucknorris.png')

      // Submit form
      const submitButton = document.querySelector('button[type="submit"]')
      fireEvent.click(submitButton);

      // ! Temporarily add "not" to test with a valid format first. 
      expect(window.alert).not.toBeCalledWith('Format du justificatif non valide. Veuillez choisir un fichier au format jpg, jpeg ou png.')
    })
  })
  describe("When I am on NewBill Page, fill the required fields and add a file with a valid extension", () => {
    test("Then the bill should be saved and I should be redirected to bills page", async () => {

      // Set mockedBill. It will be compared with the data send with POST.
      const mockedBill = {
        "type": "Transports",
        "date": "2020-01-01",
        "amount": 400,
        "pct": 10,
        "fileName": 'myFile.jpg'
      }

      // Set page
      // TODO : set in beforeeach
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

      // Fill required form fields
      // ! First method
      const formNewBill = screen.getByTestId('form-new-bill')
      const expenseType = screen.getByTestId('expense-type')
      expenseType.value = 'Transports'
      const datePicker = screen.getByTestId('datepicker')
      datePicker.value = '2020-01-01'
      const amount = screen.getByTestId('amount')
      amount.value = '100'
      const pct = screen.getByTestId('pct')
      pct.value = '10'
      // ! Need to use handlechangefile ?
      const fileInput = screen.getByTestId('file')
      fileInput.filename = 'myFile.jpg'
      // ! Second method with firevent.change
      // const expenseType = screen.getByTestId('expense-type')
      // fireEvent.change(expenseType, { target: { value: 'Transports' } })
      // const datePicker = screen.getByTestId('datepicker')
      // fireEvent.change(datePicker, { target: { value: '2020-01-01' } })
      // const amount = screen.getByTestId('amount')
      // fireEvent.change(amount, { target: { value: '100' } })
      // const pct = screen.getByTestId('pct')
      // fireEvent.change(pct, { target: { value: '10' } })
      // const fileInput = screen.getByTestId('file')
      // ! Error : This input element accepts a filename, which may only be programmatically
      // ! set to the empty string.
      // fireEvent.change(fileInput, { target: { value: 'myFile.jpg' } })

      // Submit form
      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
  
      const e = {
        preventDefault: jest.fn(),
        // target: { value: fileInput }
        target : formNewBill
      };
      const handleSubmit = jest.fn(newBill.handleSubmit(e))

      
      const submitButton = document.querySelector('button[type="submit"]')
      submitButton.addEventListener("submit", handleSubmit);
      fireEvent.submit(submitButton);

      // Check and compare data send with POST
      expect(handleSubmit).toHaveBeenCalled()

      // ! Old tests
      // const handleSubmit = jest.fn((e) => e.preventDefault());
      // const onSubmitSpy = jest.fn();
      // expect(onSubmitSpy).toHaveBeenCalledWith({
      //   type: 'Transports',
      //   date: '2020-01-01',
      //   amount: 100,
      //   pct: 10,
      //   fileName: 'myFile.jpg'
      // })
      // Expect data send with post to be equal to mockedBill

      // Redirect to bills page
      // ! Needs to check this.onNavigate(ROUTES_PATH['Bills'])
      // await waitFor(() => screen.getByTestId('icon-mail'))
      // const mailIcon = screen.getByTestId('icon-mail')
      // expect(mailIcon.classList.contains('active-icon')).toBe(true)
    })
  })
})