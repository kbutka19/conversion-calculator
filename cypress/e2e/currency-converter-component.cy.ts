describe('Currency Converter Component', () => {
  beforeEach(() => {
    cy.visit('/currency-converter');
  });

  it('should load the currency converter form', () => {
    cy.get('loadingPage').should('not.exist', { timeout: 30000 });
    cy.get('[data-cy="fromCurrency"]').should('exist');
    cy.get('[data-cy="toCurrency"]').should('exist');
    cy.get('[data-cy="fromAmount"]').should('exist');
    cy.get('[data-cy="toAmount"]').should('exist');
    cy.get('[data-cy="fromDate"]').should('exist');
    cy.get('[data-cy="toDate"]').should('exist');
    cy.get('.history-button').should('exist');
    cy.get('.swap-button').should('exist');
    cy.get('.reset-button').should('exist');

  });

  it('should convert USD to EUR correctly', () => {
    // Mock API response for USD to EUR conversion
    cy.intercept('GET', 'https://api.frankfurter.app/latest?from=USD&to=EUR', {
      statusCode: 200,
      body: {
        rates: {
          EUR: 0.85,
        },
      },
    }).as('getExchangeRate');
    // Fill the form
    cy.get('[data-cy="fromAmount"]').clear({ force: true }).type('100', { force: true });
    cy.get('mat-select[data-cy="fromCurrency"]').click({ force: true });
    cy.get('mat-option').contains('United States Dollar').click({ force: true });
    cy.get('mat-select[data-cy="toCurrency"]').click({ force: true });
    cy.get('mat-option').contains('Euro').click({ force: true });
    // Wait for the API response
    cy.wait('@getExchangeRate');
    // Verify the result
    cy.get('[data-cy="toAmount"]').should('have.value', '85');
  });


  it('should handle same currency conversion', () => {
    // Fill the form
    cy.get('[data-cy="fromAmount"]').clear({ force: true }).type('100', { force: true });
    cy.get('mat-select[data-cy="fromCurrency"]').click({ force: true });
    cy.get('mat-option').contains('Canadian Dollar').click({ force: true });
    cy.get('mat-select[data-cy="toCurrency"]').click({ force: true });
    cy.get('mat-option').contains('Canadian Dollar').click({ force: true });
    cy.wait(1000)
    // Verify the result
    cy.get('[data-cy="toAmount"]').should('have.value', '100');
  });


  it('should handle error rensponse', () => {
    // Mock API response for USD to EUR conversion
    cy.intercept('GET', 'https://api.frankfurter.app/latest?from=USD&to=EUR', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
      },
    }).as('getExchangeRate');
    // Fill the form
    cy.get('[data-cy="fromAmount"]').type('100', { force: true });
    cy.get('mat-select[data-cy="fromCurrency"]').click({ force: true });
    cy.get('mat-option').contains('United States Dollar').click({ force: true });
    cy.get('mat-select[data-cy="toCurrency"]').click({ force: true });
    cy.get('mat-option').contains('Euro').click({ force: true });
    cy.wait(1000);
    // Wait for the API response
    cy.wait('@getExchangeRate');
    // Verify the result
    cy.get('div[matsnackbarlabel').should('be.visible').and('contain', 'Exchange Rate not found');
  });


  it('should enable history button whenn dates are selected ', () => {
    // Fill the form
    cy.get('mat-select[data-cy="fromCurrency"]').click({ force: true });
    cy.get('mat-option').contains('Bulgarian Lev').click({ force: true });
    cy.get('mat-select[data-cy="toCurrency"]').click({ force: true });
    cy.get('mat-option').contains('Brazilian Real').click({ force: true });
    cy.wait(1000);
    cy.get('[data-cy="fromDate"]').type('7/1/2022', { force: true });
    cy.get('[data-cy="toDate"]').type('7/1/2024', { force: true });
    cy.wait(1000);
    // Verify the result
    cy.get('.history-button').should('not.be.disabled');
  });
}
)