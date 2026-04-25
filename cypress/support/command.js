Cypress.Commands.add("login", (email, password) => {
    cy.visit("/login")
    // Fill the login form
    cy.get("#username").clear().type(email)
    cy.get("#password").clear().type(password)
    cy.get("#form-login a.btn-success").click()
    // Post condition
    cy.url().should("include", "/dashboard")
})

Cypress.Commands.add("checkPagination", (target) => {
    cy.get(`#pagination-${target}`).should('be.visible').find('.btn-page').each(($btn) => {
        // Check data-page attr
        cy.wrap($btn).should('have.attr', 'data-page').and('match', /^\d+$/)
        // Check title
        cy.wrap($btn).should('have.attr', 'title').and('match', /^Open page:/)
    })
})

Cypress.Commands.add("clearAll", () => {
    // Clear local, session storage, and cookie
    cy.clearAllLocalStorage()
    cy.clearAllCookies()
    cy.clearAllSessionStorage()
})