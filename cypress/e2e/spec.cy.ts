describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Unit Converter');
    cy.contains('.logo-image');
  })
})
