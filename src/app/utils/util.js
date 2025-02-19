import { environment } from 'src/environments/environment';


export const getThemeColor = () => {
    let color ;
    try {
        color = localStorage.getItem(environment.themeColorStorageKey) || environment.defaultColor
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : getThemeColor -> error", error)
        color = environment.defaultColor
    }
    let isDarkModeActive = color.indexOf('dark') > -1;
    if (isDarkModeActive) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    return color;
}
export const setThemeColor = (color) => {
    try {
        if (color) {
            localStorage.setItem(environment.themeColorStorageKey, color);
        } else {
            localStorage.removeItem(environment.themeColorStorageKey)
        }
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : setThemeColor -> error", error)
    }
}
export const getThemeRadius = () => {
    let radius;
    try {
        radius = localStorage.getItem(environment.themeRadiusStorageKey) || 'rounded';
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : getThemeRadius -> error", error)
        radius = 'rounded'
    }
    return radius;
}
export const setThemeRadius = (radius) => {
    try {
        localStorage.setItem(environment.themeRadiusStorageKey, radius);
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : setThemeRadius -> error", error)
    }
}

export const getThemeLang = () => {
    let lang ;
    try {
        lang = localStorage.getItem('theme_lang') || 'en';
        localStorage.setItem('direction','ltr');
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : getThemeLang -> error", error)
        lang = 'en'
        localStorage.setItem('direction', 'ltr');
    }
    return lang;
}
export const setThemeLang = (lang,direction) => {
    try {
        localStorage.setItem('theme_lang', lang);
        localStorage.setItem('direction', direction);
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : setThemeLang -> error", lang)
    }
}

export const getUserRole = () => {
  let role;
  try {
      role = localStorage.getItem('theme_user_role') || environment.defaultRole;
  } catch (error) {
      console.log(">>>> src/app/utils/util.js : getUserRole -> error", error)
      role = environment.defaultRole
  }
  return role;
}
export const setUserRole = (role) => {
  try {
      localStorage.setItem('theme_user_role', role);
  } catch (error) {
      console.log(">>>> src/app/utils/util.js : setUserRole -> error", role)
  }
}
