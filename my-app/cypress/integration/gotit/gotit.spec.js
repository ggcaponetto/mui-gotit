describe('example gotit app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:3000')
  })

  it('display a notification', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get('button').each(($el, index, $list) => {
      if($el.text().includes('remove group app-fade')){
        return ;
      } else {
        cy.wrap($el).click();
        let el = cy.get('.MuiSnackbar-root').should("exist");
        cy.wait(4000);
        el.should("not.exist");
      }
    });
  })
})
