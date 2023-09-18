import { IConfig } from "./models/config";

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


  export function rawImageURL (artistConfig: IConfig, imagePath: string, size: string) {
    const uri = `https://raw.githubusercontent.com/${artistConfig.github_owner}/${artistConfig.github_repo}/${artistConfig.github_branch}/images`
    if (size)
      return `${uri}/${size}/${imagePath}`
    else 
      return `${uri}/${imagePath}`
  
  }
