document.addEventListener('DOMContentLoaded', () => {

  const screenWidth = window.innerWidth;

  const contactArticleContainer = document.querySelector('.contact_article_container');
  const contactTitleContainer = contactArticleContainer.querySelector('.contact_title_container');
  const infoAboutProjectContainer = contactArticleContainer.querySelector('.info_about_project_container');
  const contactTitleDesc = contactTitleContainer ? contactTitleContainer.querySelector('.contact_title_desc') : null;
  const sociable = contactTitleDesc ? contactTitleDesc.querySelector('.contact_title_desc_sociable') : null;

  const flag = !sociable && contactTitleContainer && infoAboutProjectContainer;

  if (screenWidth >= 360 && screenWidth < 768) {
      if (flag) {
          contactArticleContainer.insertBefore(contactTitleContainer, infoAboutProjectContainer);
          contactArticleContainer.insertBefore(infoAboutProjectContainer, contactTitleContainer.nextSibling);
          contactTitleDesc.style.display = 'flex';
          contactTitleDesc.style.flexDirection = 'column';
          contactTitleDesc.style.justifyContent = 'flex-end'; 
          contactTitleDesc.style.textAlign = 'right';
          contactTitleDesc.style.height = '100%';
          document.querySelector('.contact_title_container').style.marginBottom = '20px';
          document.querySelector('.contact_title_container').style.width = '100%';
          document.querySelector('.info_about_project_container').style.marginBottom = '0';
      }

  } else if (screenWidth >= 768 && screenWidth < 1920 && flag) {
      document.querySelector('.contact_title_desc').style.justifyContent = 'flex-end';
      document.querySelector('.contact_title_desc').style.width = '162px';
      document.querySelector('.contact_title_desc').style.textAlign = 'end';
      document.querySelector('.contact_article_container').style.alignItems = 'flex-end';
  } else if (screenWidth >= 1920 && flag) {
      contactArticleContainer.insertBefore(contactTitleContainer, infoAboutProjectContainer);
      contactArticleContainer.insertBefore(infoAboutProjectContainer, contactTitleContainer.nextSibling);
      contactTitleDesc.style.display = 'flex';
      contactTitleDesc.style.flexDirection = 'column';
      contactTitleDesc.style.justifyContent = '';
      contactTitleDesc.style.textAlign = 'right';
      contactTitleDesc.style.height = '100%';
      document.querySelector('.contact_title_container').style.marginBottom = '20px';
      document.querySelector('.contact_title_container').style.width = '100%';
      document.querySelector('.info_about_project_container').style.marginBottom = '0';
      document.querySelector('.info_about_project_container').style.width = '100%';
  }
});