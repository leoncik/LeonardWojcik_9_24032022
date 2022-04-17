/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import mockStore from "../__mocks__/store";
import { formatDate } from "../app/format.js"
import router from "../app/Router.js";

// Necessary for toBeVisible method
import '@testing-library/jest-dom/extend-expect'

jest.mock("../app/Store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      // Set page
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      // Check if bill icon is highlighted
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)

    })

    test("Then bills should be ordered from earliest to latest", () => {

      // Set page
      document.body.innerHTML = BillsUI({ data: bills })

      // Retrieve dates from mocked bills, sort them and format them
      let mockedDates = bills.map(elt => elt.date)
      mockedDates.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB - dateA
      })
      mockedDates = mockedDates.map(elt => formatDate(elt))
      
      // Retrieve dates from DOM (should already be sorted and formatted) and compare them with mocked dates
      const dates = screen.getAllByText(/^\b([1-9]|[12][0-9]|3[01]) (Jan|Fév|Mar|Avr|Mai|Jui|Aoû|Sep|Oct|Nov|Déc)(\. )([0-9][0-9])$\b/).map(a => a.innerHTML)
      expect(dates).toEqual(mockedDates)
    })

    describe("Bills data is not corrupted", () => {
      test("Then bills should have their date formatted", () => {

        // Retrieve dates from DOM (should already be sorted and formatted) and compare them with mocked dates
        const dates = screen.getAllByText(/^\b([1-9]|[12][0-9]|3[01]) (Jan|Fév|Mar|Avr|Mai|Jui|Aoû|Sep|Oct|Nov|Déc)(\. )([0-9][0-9])$\b/).map(a => a.innerHTML)
        expect(dates).toEqual(bills.map(elt => formatDate(elt.date)))
        })
    })
    describe("Bills data is corrupted", () => {
      test("Then bills should have their date unformatted", () => {
        let corruptedDates = ['003 Février 2004', '11 Aavril 1999', '42 Décembre 2020']
        corruptedDates = formatDate(corruptedDates)
        expect(corruptedDates).toEqual(['003 Février 2004', '11 Aavril 1999', '42 Décembre 2020'])
      })
    })


    describe("There are bills and when I click on eye icon", () => {
      test("Then a modal should open ", async () => {

        // Init Bill
        const store = null
        const bill = new Bills({
          document, onNavigate, store, localStorage: window.localStorage
        })

        // Click on eye icon
        const eye = screen.getAllByTestId('icon-eye')
        const singleEye = eye[0]
        $.fn.modal = jest.fn()
        const handleClickIconEye = jest.fn(bill.handleClickIconEye(singleEye))
        singleEye.addEventListener('click', handleClickIconEye)
        userEvent.click(singleEye)

        // Check if modal is open
        expect(handleClickIconEye).toHaveBeenCalled()
  
        await waitFor(() => screen.getByTestId('modaleFile'))
        const modale = screen.getByTestId('modaleFile')
        expect(modale).toBeVisible()

        await waitFor(() => screen.getAllByText('Justificatif'))
        const modalText = screen.getAllByText('Justificatif')[0]
        expect(modalText).toBeVisible()
      })
    })

    
    describe("When I click on new bill button ('Nouvelle note de frais')", () => {
      test("Then It should render NewBill page", async () => {
        // Reset DOM from previous tests
        document.body.innerHTML = ''

        // Set page
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        const store = null
        const bill = new Bills({
          document, onNavigate, store, localStorage: window.localStorage
        })

        // Click on new bill button
        const handleClickNewBill = jest.fn(bill.handleClickNewBill())
        await waitFor(() => screen.getByTestId('btn-new-bill'))
        const newBillButton = screen.getByTestId("btn-new-bill");
        expect(newBillButton).toBeTruthy()
        newBillButton.addEventListener('click', handleClickNewBill)
        fireEvent.click(newBillButton);
        
        // Check if new bill page is rendered
        expect(handleClickNewBill).toHaveBeenCalled()
        expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
      })
    }) 
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
      // Reset DOM from previous tests
      document.body.innerHTML = ''

      // Set page
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      // Check page content
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const contentType = await screen.getByText("Type")
      expect(contentType).toBeTruthy()
      const contentName = await screen.getByText("Nom")
      expect(contentName).toBeTruthy()
      const contentDate = await screen.getByText("Date")
      expect(contentDate).toBeTruthy()
      const contentPrice = await screen.getByText("Montant")
      expect(contentPrice).toBeTruthy()
      const contentState = await screen.getByText("Statut")
      expect(contentState).toBeTruthy()
      const contentActions = await screen.getByText("Actions")
      expect(contentActions).toBeTruthy()

      // Check if all bills are fetched
      await waitFor(() => screen.getByTestId("tbody"))
      const currentBillsContainer = screen.getByTestId("tbody")
      const currentBills = currentBillsContainer.querySelectorAll("tr")
      // 4 is the number of bills in the mock store
      expect(currentBills.length).toBe(4)
    })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

  })
})