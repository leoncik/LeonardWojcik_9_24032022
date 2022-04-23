/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import {localStorageMock} from "../__mocks__/localStorage.js"
import { ROUTES_PATH} from "../constants/routes.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { errorFileMessage } from "../__mocks__/errorMessages.js"

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

    })
  })
})

describe("When I am on NewBill Page and add a file", () => {
  test("Then the file info should be added with handleChangeFile", async () => {

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
    const newBill = new NewBill({
      document, onNavigate, store, localStorage: window.localStorage
    })

    const e = {
      preventDefault: jest.fn(),
      target : fileInput
    };
    const handleChangeFile = jest.fn(newBill.handleChangeFile(e))
    fireEvent.click(fileInput);
    expect(handleChangeFile).toHaveBeenCalled
  })
})

// test d'intégration POST
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page, add a file with a wrong extension and try to submit form", () => {
    test("Then an alert should appear and the bill should not be saved", async () => {

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
        target : fileInput
      };
      const handleChangeFile = jest.fn(newBill.handleChangeFile(e))
      fileInput.addEventListener('change', handleChangeFile)
      Object.defineProperty(fileInput, 'value', {
        value: 'chucknorris.webp',
        writable: true,
      });
      expect(handleChangeFile).toHaveBeenCalled


      // Submit form
      const submitButton = document.querySelector('button[type="submit"]')
      fireEvent.click(submitButton);

      expect(window.alert).toBeCalledWith(errorFileMessage)
    })
  })
  describe("When I am on NewBill Page, fill the required fields and add a file with a valid extension", () => {
    test("Then the bill should be saved", async () => {

      // Clear all mocks and reset page
      jest.clearAllMocks()
      document.body.innerHTML = ''

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
      document.body.innerHTML = NewBillUI();
      const inputData = {
        vat: 80,
        fileUrl: 'chucknorris.png',
        status: "pending",
        type: "Hôtel et logement",
        commentary: "séminaire billed",
        name: "encore",
        fileName: null,
        date: "2004-04-04",
        amount: 400,
        email: undefined,
        pct: 20
      };

      // Fill required fields
      const expenseType = screen.getByTestId('expense-type')
      fireEvent.change(expenseType, { target: { value: inputData.type } })
      expect(expenseType.value).toBe(inputData.type)

      const datePicker = screen.getByTestId('datepicker')
      fireEvent.change(datePicker, { target: { value: inputData.date } })
      expect(datePicker.value).toBe(inputData.date)

      const amount = screen.getByTestId('amount')
      fireEvent.change(amount, { target: { value: inputData.amount } })
      expect(amount.value).toBe(inputData.amount.toString())

      const pct = screen.getByTestId('pct')
      fireEvent.change(pct, { target: { value: inputData.pct } })
      expect(pct.value).toBe(inputData.pct.toString())

      const fileInput = screen.getByTestId('file')
      Object.defineProperty(fileInput, 'value', {
        value: 'chucknorris.png',
        writable: true,
      });

      // Fill optional fields
      const vat = screen.getByTestId('vat')
      fireEvent.change(vat, { target: { value: inputData.vat } })
      expect(vat.value).toBe(inputData.vat.toString())

      const commentary = screen.getByTestId('commentary')
      fireEvent.change(commentary, { target: { value: inputData.commentary } })
      expect(commentary.value).toBe(inputData.commentary)

      const expenseName = screen.getByTestId('expense-name')
      fireEvent.change(expenseName, { target: { value: inputData.name } })
      expect(expenseName.value).toBe(inputData.name)

      const formNewBill = screen.getByTestId('form-new-bill')

      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })

      // Submit data
      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.updateBill = jest.fn().mockResolvedValue({})
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled()
      expect(window.alert).not.toBeCalledWith(errorFileMessage)

      // Check and compare data send with POST
      expect(newBill.updateBill).toHaveBeenCalledWith({
        vat: inputData.vat.toString(),
        fileUrl: inputData.fileUrl,
        status: inputData.status,
        type: inputData.type,
        commentary: inputData.commentary,
        name: inputData.name,
        fileName: inputData.fileName,
        date: inputData.date,
        amount: inputData.amount,
        email: inputData.email,
        pct: inputData.pct
      })

    })
  })
})