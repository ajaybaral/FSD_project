tlyrking correcints are wodpo] API enoved
- [ code is remtesting e ragto] All localS00)
- [ nd (port 42tered for fronfigu conRS is ] COated
- [bles are crebase ta
- [ ] Data81port 80 running on ckend isstration ba Regig
- [ ]e is runnin databasSQLPostgre- [ ] Checklist:
# Testing ts

#ommenng ctestiup any Clean keys
- age lStorUser` locaentd `currUsers` anredregistee `- Remove thuser data
ations for rage operlStolocaove all  RemCode
-sting age Te Storcalmove Lo### 4. Re`

end port
``ckion bagistratRe/ ;  /t:8081/api'calhoshttp://loe apiUrl = 'pt
privatypescri
```t';
```
to:0/apit:808osocalh 'http://le apiUrl =vatpt
pricriypes```te from:
 servicin auth `apiUrl` ange theRL
Chate API U## 3. Upd
   ```

#}  );
        or)
leErrandhis.hError(t   catch  
    ,
         })});         username
   response.  username:         
  me,usernaresponse.:  email          
  t({.nextais.userDa    th     {
   => ponsetap(res        e(
  .pip   )
   ders() }s.getAuthHeahi{ headers: tpoint}`, ndl}/roles/${eapiUr>(`${this.nsedResposhboar.http.get<Daurn this  ret;
   '-')place('_', .rerCase()le.toLowerodpoint =    const en
     
  }    ;
 le found'))No row Error('=> ne(() Errorurn throwret {
       role)  if (!);
   .userRoleKeytItem(thistorage.geole = localSt rns coe> {
    Responsashboardle<DObservab): board(sh
   getDatypescript15):
   ```(lines 185-2hod** etboard() mace getDash **Repl

3.
   ```   );
   }   
 ))r.bind(thisleErroor(this.handrrcatchE
         }),
         ext(true);bject.nedSuthenticatthis.isAu   
        onse.role);sprRole(re this.setUse         ;
 en)esponse.toktToken(rhis.se      t    }
          
  ');from serversponse valid rer('Inw Erro  throw ne     e) {
      esponse?.rol| !rtoken |?.sesponf (!re i       e => {
   ns   tap(respo(
      pipe  . })
     eaders(): this.getH, { headers, datah/login`.apiUrl}/autse>(`${thisginRespon<Lo.posthttprn this.
     retu;:', data)ogin requesting lle.log('Sendonso
     csponse> {ble<LoginRet): Observa LoginRequesdata:  login(cript
 ypes0):
   ```t25-17nes 1od** (lithe login() me **Replac```

2.   
   }
   );his))
    r.bind(thandleError(this.atchErro
         ce)),', responssponse: reog('Signup> console.le =ns(respo         tape(
pip      .ers() })
 is.getHead headers: th data, {ignup`,/auth/siUrl}`${this.appResponse>(st<Signu.http.poturn thisa);
     reatuest:', d signup reqdingennsole.log('S
     co> {seResponSignupable<st): ObservReque: Signup signup(dataescript
  ```typ):
   60-110od** (lines  meth()ace signup

1. **Repl:ts`uth.service.rvices/app/auth/sed
In `src/aquire Changes Re 2. Frontend

###```er
rivl.Dg.postgresqass-name=orclurce.driver-datasot
spring.rd=roorce.passwosoupring.datastgres
same=poerne.usg.datasourcb
sprinond3/registrati:543st/localhotgresql:/c:pos=jdbe.url.datasources
spring.propertion applicati
#iesopert
```prwith:nfigured `) is co/fsd/rationegist1_Rt backend (`pring Booe your Sn
EnsurioiguratBackend Conf

### 1. :aseeSQL Databstgrto PoConnect 

## To oragelocalStm  data fro useretrieves rd -ethoboard()` mgetDash185-215**: `**Lines - Storage
 localainst ag credentials- validatesethod in()` m-170**: `logLines 125orage
- **calStlo in er datatores us method - s`signup()`110**:  **Lines 60-ice.ts`)
-es/auth.servrvicpp/auth/see (`src/aervic1. Auth S### ting:

r Local Tesed foes Modifi

## Fildatabase. PostgreSQL d ofstealStorage inocasing l testing ur local foguredconfiently tion is currhe applicaMODE

TING L TESTus: LOCAtatt S
## Currene
tion GuidntegrareSQL I# Postg