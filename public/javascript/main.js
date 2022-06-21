const showNavBar = () => {
  const nav = document.getElementsByClassName( 'navbar' );

  for( i = 0; i < nav.length; i++ ) {
    nav[i].style.width = '70%';
    nav[i].style.border = '1px solid white';
  }
};

const closeNavBar = () => {
  const nav = document.getElementsByClassName( 'navbar' );

  for( i = 0; i < nav.length; i++ ) {
    nav[i].style.width = '0';
    nav[i].style.border = 'none';
  }
};