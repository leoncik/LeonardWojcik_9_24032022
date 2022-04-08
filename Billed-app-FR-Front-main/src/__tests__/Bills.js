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

import router from "../app/Router.js";
import NewBillUI from "../views/NewBillUI.js";

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

    // ! Tests not working
    describe("There are bills and when I click on eye icon", () => {
      test("Then a modal should open ", () => {
        // ! New test
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI({ data: bills })
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const bill = new Bills({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })
  
        const handleClickIconEye = jest.fn(bill.handleClickIconEye)
        const eye = screen.queryAllByTestId('icon-eye')
        const singleEye = eye[0]
        singleEye.addEventListener('click', handleClickIconEye)
        // eye.addEventListener('click', bill.handleClickIconEye(eye))
        userEvent.click(singleEye)
        expect(handleClickIconEye).toHaveBeenCalled()
  
        const modale = screen.getByTestId('modaleFile')
        expect(modale).toBeTruthy()

        // ! Old test   
        // const html = Actions()
        // document.body.innerHTML = html
        // // document.body.innerHTML = BillsUI({ data: bills })
        // const iconEye = screen.getByTestId('icon-eye')
        // const handleClickIconEye = jest.fn(iconEye.handleClickIconEye)
        // iconEye.addEventListener('click', handleClickIconEye())
        // userEvent.click(iconEye)
        // expect(handleClickIconEye).toHaveBeenCalled()

        // const modale = screen.getByTestId('modaleFile')
        // expect(modale).toBeTruthy() 
      })
    })

    
    describe("When I click on 'Nouvelle note de frais'", () => {
      test("Then It should render NewBill page", async () => {
        // ! New test
        // document.body.innerHTML = BillsUI({ data: bills })
        // const store = null
        // const bill = new Bills({
        //   document, onNavigate, store, bills, localStorage: window.localStorage
        // })
        // await waitFor(() => screen.getByTestId('btn-new-bill'))
        // const newBillButton = screen.getByTestId("btn-new-bill");
        // expect(newBillButton).toBeTruthy()
        // fireEvent.click(newBillButton);
        
        // expect(bill.handleClickNewBill()).toHaveBeenCalled
        // expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()

        // ! Old test 
        // document.body.innerHTML = BillsUI({ data: bills })
        // const handleClickNewBill = jest.fn(bills.handleClickNewBill)
        // const newBillButton = screen.getByTestId("btn-new-bill");
        // fireEvent.click(newBillButton);
        // expect(handleClickNewBill).toHaveBeenCalled
        // expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
      })
    }) 
  })
})

// test d'intégration GET
/*
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
      const contentPending  = await screen.getByText("En attente (1)")
      expect(contentPending).toBeTruthy()
      const contentRefused  = await screen.getByText("Refusé (2)")
      expect(contentRefused).toBeTruthy()
      expect(screen.getByTestId("big-billed-icon")).toBeTruthy()
    })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
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
}) */
