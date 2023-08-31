export function isAnon(user = null) {
    console.log("isAnon",user);
    if (!user) {
       console.log("no user")
        return true;
    }
    else {
        console.log('have user', user);
        return user.identities[0].providerType === 'anon-user'
    }
    //   return user === null || user.identities[0].providerType === 'anon-user'
  }
