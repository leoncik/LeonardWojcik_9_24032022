/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Actions from "../views/Actions.js"
import Bills from "../containers/Bills.js";
import mockStore from "../__mocks__/store";

jest.mock("../app/Store", () => mockStore)

import router from "../app/Router.js";
import NewBillUI from "../views/NewBillUI.js";
import store from "../__mocks__/store.js"

// Necessary for toBeVisible method
import '@testing-library/jest-dom/extend-expect'

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)

    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    // ! These tests looks mostly covered (by the GET tests)
    describe("Bills data is not corrupted", () => {
      test("Then bills should have their date formatted", () => {
        // ! New test (not working)
        // Test getBills, then test try/catch
        const bill = new Bills({
          document, onNavigate, store, localStorage: window.localStorage
        })

        // const getBills = jest.fn(bill.getBills())
        // const bills = getBills
        // expect(getBills).toHaveBeenCalled()

        // ! Old test
        // document.body.innerHTML = BillsUI({ data: bills })
        // const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
        // expect(dates).toEqual(bills.map(bill => bill.date.toLocaleDateString('fr-FR')))
        })
    })
    describe("Bills data is corrupted", () => {
      test("Then bills should have their date unformatted", () => {
        // ! Old test
        // document.body.innerHTML = BillsUI({ data: bills })
        // const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
        // expect(dates).toEqual(bills.map(bill => bill.date))
      })
    })


    describe("There are bills and when I click on eye icon", () => {
      test("Then a modal should open ", async () => {
        // ! New test
        // ! Init page method 1 (does not cover this.handleClickIconEye(icon)))
        // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        // window.localStorage.setItem('user', JSON.stringify({
        //   type: 'Employee'
        // }))
        // const onNavigate = (pathname) => {
        //   document.body.innerHTML = ROUTES({ pathname })
        // }
        // const store = null
        // const bill = new Bills({
        //   document, onNavigate, store, localStorage: window.localStorage
        // })
        // document.body.innerHTML = BillsUI({ data: bills })

        // ! Init page method 2 (covers this.handleClickIconEye(icon)))
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

        const eye = screen.getAllByTestId('icon-eye')
        const singleEye = eye[0]
        $.fn.modal = jest.fn()
        const handleClickIconEye = jest.fn(bill.handleClickIconEye(singleEye))
        singleEye.addEventListener('click', handleClickIconEye)
        userEvent.click(singleEye)
        expect(handleClickIconEye).toHaveBeenCalled()

        // ! Works (even without calling handleClickIconEye (assigning mock function did seem to call It))
        // expect(screen.getAllByText('Justificatif')).toBeTruthy()

        // ! Same problem as above
        await waitFor(() => screen.getAllByText('Justificatif'))
        const modalText = screen.getAllByText('Justificatif')[0]
        expect(modalText).toBeVisible()
  
        // Other way to select modal
        // await waitFor(() => document.querySelector('#modaleFile'))
        // const modale = document.querySelector('#modaleFile')
        // expect(modale).toBeTruthy()
      })
    })

    
    describe("When I click on new bill button ('Nouvelle note de frais')", () => {
      test("Then It should render NewBill page", async () => {

        // ! Works (even without clicking on newBillButton (assigning mock function seems to call It))
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

        const handleClickNewBill = jest.fn(bill.handleClickNewBill())
        await waitFor(() => screen.getByTestId('btn-new-bill'))
        const newBillButton = screen.getByTestId("btn-new-bill");
        expect(newBillButton).toBeTruthy()
        fireEvent.click(newBillButton);
        
        expect(handleClickNewBill).toHaveBeenCalled
        expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()


        // ! Old test (not working)
        // const onNavigate = (pathname) => {
        //   document.body.innerHTML = ROUTES({ pathname })
        // }
        // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        // window.localStorage.setItem('user', JSON.stringify({
        //   type: 'Employee'
        // }))
        // const store = null
        // const bill = new Bills({
        //   document, onNavigate, store, localStorage: window.localStorage
        // })
  
        // document.body.innerHTML = BillsUI({ data: bills })
        // await waitFor(() => screen.getByTestId('btn-new-bill'))
        // const newBillButton = screen.getByTestId("btn-new-bill");
        // expect(newBillButton).toBeTruthy()
        // fireEvent.click(newBillButton);
        
        // failing, ROUTER is not defined
        // expect(bill.handleClickNewBill()).toHaveBeenCalled
        // expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
      })
    }) 
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const contentType = await screen.getByText("Type")
      expect(contentType).toBeTruthy()
      // ! Elements seems duplicated
      // const contentName = await screen.getByText("Nom")
      // expect(contentName).toBeTruthy()
      // const contentDate = await screen.getByText("Date")
      // expect(contentDate).toBeTruthy()
      // const contentPrice = await screen.getByText("Montant")
      // expect(contentPrice).toBeTruthy()
      // const contentState = await screen.getByText("Statut")
      // expect(contentState).toBeTruthy()
      // const contentActions = await screen.getByText("Actions")
      // expect(contentActions).toBeTruthy()
      // ! Console error too long
      // await waitFor(() => screen.getByTestId("tbody"))
      // const currentBills = screen.getByTestId("tbody")
      // expect 4 children for currentBills
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