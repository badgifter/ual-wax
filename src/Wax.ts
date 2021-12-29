import { Authenticator, Chain, User, UALError, UALErrorType } from 'universal-authenticator-library';
import { ApiInterfaces } from 'eosjs';
// import js as this is not ES module
import { WaxJS } from '@nft-blender/waxjs/dist/index.js';
import { WaxUser } from './WaxUser';
import { UALWaxError } from './UALWaxError';

const WaxIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEt2lUWHRYTU
w6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpy
ZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az
0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8x
OTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIg
ogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0
aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaH
R0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25z
LmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3
hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9z
VHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjMwIgogICBleGlmOl
BpeGVsWURpbWVuc2lvbj0iMzAiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgdGlmZjpJbWFnZVdp
ZHRoPSIzMCIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMzAiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9Ij
IiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLjAiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLjAiCiAg
IHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQz
YxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDYtMTlUMDI6MDE6NDgrMDI6MDAiCiAg
IHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDYtMTlUMDI6MDE6NDgrMDI6MDAiPgogICA8eG1wTU06SG
lzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9k
dWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gKE1hciAzMSAyMD
IwKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMC0wNi0xOVQwMjowMTo0OCswMjowMCIvPgogICAgPC9y
ZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSRE
Y+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+b+esCwAAAYJpQ0NQc1JHQiBJRUM2MTk2
Ni0yLjEAACiRdZHPK0RRFMc/ZjCTH42QLCwmYTUjRk1slJmEkjRGGWxm3vxS8+P13kiyVbZTlNj4te
AvYKuslSJSsrKwJjZMz3kzUyOZczv3fO733nO691ywBFNKWq8dgHQmpwUmfM6F0KLT9kI9rXTgwR5W
dHVsdnaaqvZ5T40Zb91mrern/rXGaExXoMYuPKqoWk54Unh6LaeavCPcriTDUeEzYZcmFxS+M/VIiV
9NTpT422QtGPCDpUXYmfjFkV+sJLW0sLycnnRqVSnfx3xJUywzPyexW7wLnQAT+HAyxTh+vAwyIrMX
t/SnX1ZUyR8o5s+QlVxFZpV1NFZIkCSHS9RVqR6TGBc9JiPFutn/v33V40OeUvUmH9Q9G8Z7L9i2oZ
A3jK8jwygcg/UJLjOV/OwhDH+Inq9oPQfg2ITzq4oW2YWLLeh8VMNauChZxS3xOLydQnMI2m6gYanU
s/I+Jw8Q3JCvuoa9feiT847lH1hwZ9/TwxVHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB8klEQVRIie
2Uz0tUcRTFzx0nLTBKCHQ14cIJ+rEpxMBFuugPSHAhEdQm2kQtQ4kpaqU5u4pw1cLViBG4SKEfCFFE
SNFQEbWQmrI2UeGMhtOnxbvDPN883QvvbO4753vv+d73ffd9pQQJEiTYajBJAlKSMDMAq+kx2jpuZv
+AJknHJXVI+iZpznNSwbpMBfcbFGaioQtvYFNtg5wu4DMBHgG7JIlisbkhN3csXSu6ADwBOp33AHPA
LHAkZDwPXA5tdgv4ALwGDrg25Zsvsrp6UJJ+Tw7tWc5nxiv5zPPyaPudlYXJLqBXwBlPHvHiu9Qx4d
o15+edjzr/4rECdPja9VB93/IlnaWQpZLfu7gyltkvSaXSyx0CdgNrwCugBfgJfAWWgB+uvQPW3PiU
m753PuT8DbDdtQGgCsDf8nB5RIPfc2oNjlr1TwXc8+IbHoeBKxHtNnDYn38B/UABeBZ6wxn3O8l6jM
fOCHAikrgPOBTRLvoJABwFssAYkAPOAQ997aPHP/7mjwGoVovU5yhV27gVeEpwvPdDDT0APgEvgJIb
no5OashjGlgAZoCs683ATeAtwfzsjCtuitHavAjgqmtpIOUxDWzboJnG3wnSUv0CMTMjkmB+EXRK6p
a0ZGbzm+W7H4q5bGo8rsEECRIk2Br4D20NhhljafHuAAAAAElFTkSuQmCC`;

export class Wax extends Authenticator {
    private wax?: WaxJS;
    private users: WaxUser[] = [];

    private initiated = false;

    private session?: { userAccount: string; pubKeys: string[] };

    private readonly apiSigner?: ApiInterfaces.SignatureProvider;

    private readonly waxSigningURL: string | undefined;
    private readonly waxAutoSigningURL: string | undefined;

    constructor(
        chains: Chain[],
        options?: {
            apiSigner?: ApiInterfaces.SignatureProvider;
            waxSigningURL?: string | undefined;
            waxAutoSigningURL?: string | undefined;
        }
    ) {
        super(chains, options);

        this.apiSigner = options && options.apiSigner;

        this.waxSigningURL = options && options.waxSigningURL;
        this.waxAutoSigningURL = options && options.waxAutoSigningURL;
    }

    /**
     * Called after `shouldRender` and should be used to handle any async actions required to initialize the authenticator
     */
    async init(): Promise<void> {
        this.initWaxJS();

        try {
            if (this.wax) {
                if (await this.wax.isAutoLoginAvailable()) {
                    this.receiveLogin();
                } else {
                    const data = JSON.parse(localStorage.getItem('ual-wax:autologin') || 'null');

                    if (data && data.expire >= Date.now()) {
                        this.receiveLogin(data.userAccount, data.pubKeys);
                    }
                }
            }
        } catch (e) {
            console.log('UAL-WAX: autologin error', e);
        }

        this.initiated = true;

        console.log(`UAL-WAX: init`);
    }

    /**
     * Resets the authenticator to its initial, default state then calls `init` method
     */
    reset() {
        this.wax = undefined;
        this.users = [];
        this.initiated = false;
        this.session = undefined;
    }

    /**
     * Returns true if the authenticator has errored while initializing.
     */
    isErrored() {
        return false;
    }

    /**
     * Returns a URL where the user can download and install the underlying authenticator
     * if it is not found by the UAL Authenticator.
     */
    getOnboardingLink() {
        return 'https://all-access.wax.io/';
    }

    /**
     * Returns error (if available) if the authenticator has errored while initializing.
     */
    getError(): UALError | null {
        return null;
    }

    /**
     * Returns true if the authenticator is loading while initializing its internal state.
     */
    isLoading(): boolean {
        return !this.initiated;
    }

    /**
     * Returns the style of the Button that will be rendered.
     */
    getStyle() {
        return {
            icon: WaxIcon,
            text: 'WAX Cloud Wallet',
            textColor: 'white',
            background: '#111111',
        };
    }

    /**
     * Returns whether or not the button should render based on the operating environment and other factors.
     * ie. If your Authenticator App does not support mobile, it returns false when running in a mobile browser.
     */
    shouldRender() {
        return true;
    }

    /**
     * Returns whether or not the dapp should attempt to auto login with the Authenticator app.
     * Auto login will only occur when there is only one Authenticator that returns shouldRender() true and
     * shouldAutoLogin() true.
     */
    shouldAutoLogin() {
        return false;
    }

    /**
     * Returns whether or not the button should show an account name input field.
     * This is for Authenticators that do not have a concept of account names.
     */
    async shouldRequestAccountName(): Promise<boolean> {
        return false;
    }

    /**
     * Returns the amount of seconds after the authentication will be invalid for logging in on new
     * browser sessions.  Setting this value to zero will cause users to re-attempt authentication on
     * every new browser session.  Please note that the invalidate time will be saved client-side and
     * should not be relied on for security.
     */
    public shouldInvalidateAfter(): number {
        return 86400;
    }

    /**
     * Login using the Authenticator App. This can return one or more users depending on multiple chain support.
     */
    async login(): Promise<User[]> {
        console.log(`UAL-WAX: login requested`);

        // Commented for now to support multiple wax chains such as testnets/staging in the future
        // Mainnet check:  this.chains[0].chainId !== '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4'
        if (this.chains.length > 1) {
            throw new UALWaxError('WAX Could Wallet only supports one WAX chain', UALErrorType.Unsupported, null);
        }

        if (!this.wax) {
            throw new UALWaxError('WAX Cloud Wallet not initialized yet', UALErrorType.Initialization, null);
        }

        try {
            if (!this.session) {
                await this.wax.login();
                this.receiveLogin();
            }

            if (!this.session) {
                throw new Error('Could not receive login information');
            }

            this.users = [new WaxUser(this.chains[0], this.session.userAccount, this.session.pubKeys, this.wax)];

            console.log(`UAL-WAX: login`, this.users);

            return this.users;
        } catch (e: any) {
            throw new UALWaxError(
                e.message ? e.message : 'Could not login to the WAX Cloud Wallet',
                UALErrorType.Login,
                e
            );
        }
    }

    /**
     * Logs the user out of the dapp. This will be strongly dependent on each Authenticator app's patterns.
     */
    async logout(): Promise<void> {
        this.initWaxJS();
        this.users = [];
        this.session = undefined;

        localStorage.setItem('ual-wax:autologin', 'null');

        console.log(`UAL-WAX: logout`);
    }

    /**
     * Returns true if user confirmation is required for `getKeys`
     */
    requiresGetKeyConfirmation(): boolean {
        return false;
    }

    /**
     * Returns name of authenticator for persistence in local storage
     */
    getName(): string {
        return 'wax';
    }

    private receiveLogin(userAccount?: string, pubKeys?: string[]) {
        if (!this.wax) {
            return;
        }

        const login = {
            // @ts-ignore
            userAccount: userAccount || this.wax.user.account,
            // @ts-ignore
            pubKeys: pubKeys || this.wax.user.keys,
            expire: Date.now() + this.shouldInvalidateAfter() * 1000,
        };

        if (!login.userAccount || !login.pubKeys) {
            return;
        }

        localStorage.setItem('ual-wax:autologin', JSON.stringify(login));
        this.session = login;
    }

    private initWaxJS() {
        this.wax = new WaxJS({
            rpcEndpoint: this.getEndpoint(),
            tryAutoLogin: false,
            apiSigner: this.apiSigner,
            waxSigningURL: this.waxSigningURL,
            waxAutoSigningURL: this.waxAutoSigningURL,
        });
    }

    private getEndpoint() {
        return `${this.chains[0].rpcEndpoints[0].protocol}://${this.chains[0].rpcEndpoints[0].host}:${this.chains[0].rpcEndpoints[0].port}`;
    }
}
