const createFooterTemplate = ({moviesAmount}) => (
  `<footer class="footer">
    <section class="footer__logo logo logo--smaller">Cinemaddict</section>
    <section class="footer__statistics">
      <p>${moviesAmount} movies inside</p>
    </section>
  </footer>`
);

export default createFooterTemplate;
