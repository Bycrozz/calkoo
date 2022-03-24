/// <reference types="cypress" />
import * as calculator from '../../fixtures/calculator.json';

const fields = calculator.fields;
const testData = calculator.testData;

beforeEach(() => {
    cy.viewport(1440, 960);
    cy.visit(calculator.URLs.mainPage);
})

describe('Test scenarios of the main calculator page', () => {
    it('Should present all expected fields correctly so the user can calculate the value', () => {
        cy.get(fields.selectCountry).should('be.visible');
        cy.get(fields.selectCountry).select(testData.oneRAteCountry);
        cy.get(fields.selectCountry).find('option:selected').should('have.text', testData.oneRAteCountry);
        cy.get(fields.VATRate20).should('be.visible');
        cy.get(fields.optPriceNoVat).should('be.visible');
        cy.get(fields.optVatPrice).should('be.visible');
        cy.get(fields.optPriceInclVat).should('be.visible');
        cy.get(fields.netValue).should('be.visible');
        cy.get(fields.VATValue).should('be.visible');
        cy.get(fields.grossValue).should('be.visible');
        cy.get(fields.clearButton).should('be.visible');
        cy.reload();
        cy.get(fields.VATRate20).should('be.visible');
        cy.get(fields.VATRate20).click();
        cy.get(fields.netValue).should('be.visible');
        cy.get(fields.netValue).type(500);
        cy.get(fields.VATpctNET).should('be.visible');
        cy.get(fields.VATpctGross).should('be.visible');
        cy.get(fields.chart).should('be.visible');
    })

    it('Calculate price without VAT by typing the price including VAT', () => {
        cy.get(fields.selectCountry).select(testData.multipleRatesCountry);
        //This is used as a guard because the application is reloading after selecting the country
        cy.get(fields.selectCountry).find('option:selected').should('have.text', testData.multipleRatesCountry);
        //this one is a guard too
        cy.get(fields.VATRate13).should('be.visible');
        //I had to use the force:true parameter because the application reloads, it's not good practice for scenarios like the element is not clickable
        //but you can force it by coding (that would not be the user behaviour), but in this case the element is visible and clickable but detached from DOM
        //after the page reloading.
        cy.get(fields.VATRate13).click({ force: true }).then(($percentage) => {
            cy.get(fields.optPriceInclVat).click();
            //here i get the percentage clicked by the user
            const VATPercent = parseFloat($percentage.text().match('\\d+').toString());
            cy.get(fields.grossValue).type(testData.totalValueWithVAT);
            //here i calculate the value based on the percentage
            const totalValue = (testData.totalValueWithVAT * 100) / ((1 + VATPercent / 100) * 100);
            // here i round up this value becase the application does it too
            const roundedValue = Math.round((totalValue + Number.EPSILON) * 100) / 100;
            //here is the assertion if the value is correct
            cy.get(fields.netValue).should('have.value', roundedValue);
        })
    })
})