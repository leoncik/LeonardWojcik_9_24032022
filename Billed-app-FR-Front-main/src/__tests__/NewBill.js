/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
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
    test("Then an alert should appear and the bill should not be saved", async () => {

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
      // fireEvent.change(fileInput)
      // expect(fileInput.value).toBe('chucknorris.png')
      // ! Test with label
      const file = new File(['chucknorris'], 'chucknorris.png', {type: 'image/png'})
      const labelFile = screen.getByLabelText(/Justificatif/)
      await userEvent.upload(labelFile, file)
      expect(labelFile.files[0]).toBe(file)
      expect(labelFile.files.item(0)).toBe(file)
      expect(labelFile.files).toHaveLength(1)

      // Submit form
      const submitButton = document.querySelector('button[type="submit"]')
      fireEvent.click(submitButton);

      // ! Temporarily add "not" to test with a valid format first. 
      expect(window.alert).not.toBeCalledWith('Format du justificatif non valide. Veuillez choisir un fichier au format jpg, jpeg ou png.')
    })
  })
  describe("When I am on NewBill Page, fill the required fields and add a file with a valid extension", () => {
    test.only("Then the bill should be saved and I should be redirected to bills page", async () => {


      // ! WARNING, TEST.ONLY IS ACTIVE !!!


      // ! OLD VERSION
      // // Set mockedBill. It will be compared with the data send with POST.
      // const mockedBill = {
      //   "type": "Transports",
      //   "date": "2020-01-01",
      //   "amount": 400,
      //   "pct": 10,
      //   "fileName": 'myFile.jpg'
      // }

      // // Set page
      // // TODO : set in beforeeach
      // jest.spyOn(window, 'alert').mockImplementation(() => {});
      // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // window.localStorage.setItem('user', JSON.stringify({
      //   type: 'Employee'
      // }))
      // const root = document.createElement("div")
      // root.setAttribute("id", "root")
      // document.body.append(root)
      // router()
      // window.onNavigate(ROUTES_PATH.NewBill)

      // // Fill required form fields
      // // ! First method
      // const formNewBill = screen.getByTestId('form-new-bill')
      // const expenseType = screen.getByTestId('expense-type')
      // expenseType.value = 'Transports'
      // const datePicker = screen.getByTestId('datepicker')
      // datePicker.value = '2020-01-01'
      // const amount = screen.getByTestId('amount')
      // amount.value = '100'
      // const pct = screen.getByTestId('pct')
      // pct.value = '10'
      // // ! Need to use handlechangefile ?
      // const fileInput = screen.getByTestId('file')
      // fileInput.filename = 'myFile.jpg'
      // // ! Second method with firevent.change
      // // const expenseType = screen.getByTestId('expense-type')
      // // fireEvent.change(expenseType, { target: { value: 'Transports' } })
      // // const datePicker = screen.getByTestId('datepicker')
      // // fireEvent.change(datePicker, { target: { value: '2020-01-01' } })
      // // const amount = screen.getByTestId('amount')
      // // fireEvent.change(amount, { target: { value: '100' } })
      // // const pct = screen.getByTestId('pct')
      // // fireEvent.change(pct, { target: { value: '10' } })
      // // const fileInput = screen.getByTestId('file')
      // // ! Error : This input element accepts a filename, which may only be programmatically
      // // ! set to the empty string.
      // // fireEvent.change(fileInput, { target: { value: 'myFile.jpg' } })

      // // Submit form
      // const newBill = new NewBill({
      //   document, onNavigate, store, localStorage: window.localStorage
      // })
  
      // const e = {
      //   preventDefault: jest.fn(),
      //   // target: { value: fileInput }
      //   target : formNewBill
      // };
      // const handleSubmit = jest.fn(newBill.handleSubmit(e))

      
      // const submitButton = document.querySelector('button[type="submit"]')
      // submitButton.addEventListener("submit", handleSubmit);
      // fireEvent.submit(submitButton);

      // // Check and compare data send with POST
      // expect(handleSubmit).toHaveBeenCalled()

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

      // ! NEW VERSION (based on Login)
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
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl: "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel et logement",
        commentary: "séminaire billed",
        name: "encore",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2004-04-04",
        amount: "400",
        commentAdmin: "ok",
        email: "a@a",
        pct: "20"
      };

      const expenseType = screen.getByTestId('expense-type')
      fireEvent.change(expenseType, { target: { value: inputData.type } })
      expect(expenseType.value).toBe(inputData.type)

      const datePicker = screen.getByTestId('datepicker')
      fireEvent.change(datePicker, { target: { value: inputData.date } })
      expect(datePicker.value).toBe(inputData.date)

      const amount = screen.getByTestId('amount')
      fireEvent.change(amount, { target: { value: inputData.amount } })
      expect(amount.value).toBe(inputData.amount)

      const pct = screen.getByTestId('pct')
      fireEvent.change(pct, { target: { value: inputData.pct } })
      expect(pct.value).toBe(inputData.pct)

      const fileInput = screen.getByTestId('file')
      // ! Problem with file input, as always...
      // fireEvent.change(fileInput, { target: { value: inputData.fileName } })
      // expect(fileInput.value).toBe(inputData.fileName)
      // ! Using "upload"
      // const file = new File(['chucknorris'], 'chucknorris.png', {type: 'image/png'})
      // const labelFile = screen.getByLabelText(/Justificatif/)
      // await userEvent.upload(labelFile, file)
      // expect(labelFile.files[0]).toBe(file)
      // expect(labelFile.files.item(0)).toBe(file)
      // expect(labelFile.files).toHaveLength(1)
      // ! Using fireEvent + Object.defineProperty
      // Todo : try to replace label with input field directly
      const labelFile = screen.getByTestId('label-file')

      Object.defineProperty(fileInput, 'value', {
        value: 'chucknorris.png',
        writable: false,
      });
      console.log(fileInput.value);



      // console.log(labelFile.textContent);
      // fireEvent.change(labelFile, {
      //   target: {
      //     files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
      //   },
      // })


      const formNewBill = screen.getByTestId('form-new-bill')

      // localStorage should be populated with formNewBill data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // Login example
      // we have to mock navigation to test it
      // const onNavigate = (pathname) => {
      //   document.body.innerHTML = ROUTES({ pathname });
      // };

      // Login example
      // let PREVIOUS_LOCATION = "";

      // Login example
      // const store = jest.fn();

      // Login example
      // const login = new Login({
      //   document,
      //   localStorage: window.localStorage,
      //   onNavigate,
      //   PREVIOUS_LOCATION,
      //   store,
      // });
      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })

      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.updateBill = jest.fn().mockResolvedValue({})
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled()
      expect(window.alert).not.toBeCalledWith('Format du justificatif non valide. Veuillez choisir un fichier au format jpg, jpeg ou png.')


      // Login example
      // const handleSubmit = jest.fn(login.handleSubmitEmployee);
      // login.login = jest.fn().mockResolvedValue({});
      // formNewBill.addEventListener("submit", handleSubmit);
      // fireEvent.submit(formNewBill);
      // expect(handleSubmit).toHaveBeenCalled();
      // expect(window.localStorage.setItem).toHaveBeenCalled();
      // expect(window.localStorage.setItem).toHaveBeenCalledWith(
      //   "user",
      //   JSON.stringify({
      //     type: "Employee",
      //     email: inputData.email,
      //     password: inputData.password,
      //     status: "connected",
      //   })
      // );
    })
  })
})