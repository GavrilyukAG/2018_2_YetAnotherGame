import BaseView from "./BaseView.js"
import Block from "../components/block/block.mjs"
import mediator from "../scripts/mediator.js"

export default class PageView extends BaseView {
    constructor(el) {
        super(el)
        this.data = null
        this.hasProfile = false
        mediator.on("profile-loaded", this.setData.bind(this))
    }

    hide() {
        super.hide()
    }

    show() {
        if (this.data === null) {
            this.fetchProfile()
        }
        this.el.show()
		if (typeof this.data === undefined || this.data == null) {
			this.render()
		}
    }

    setData(data) {
        if (typeof data === "undefined" || data === null) {
            this.hasProfile = false
        } else {
            this.hasProfile = true
        }
        this.data = data
        this.render()
    }

    fetchProfile() {
        mediator.emit("fetch-profile")
    }

    render({header=[], body=[], footer=[]} = {}) {
        const MenuPage = Block.Create("section", {"data-section-name": "menuPage", "id": "mainMenu"}, ["main"])
        const MenuHeader = Block.Create("div", {"id": "MenuHeader"}, ["main__header"])
        const MenuBody = Block.Create("div", {"id": "MenuBody"}, ["main__body"])
        const MenuFooter = Block.Create("div", {"id": "MenuFooter"}, ["main__footer"])
        const HeaderProfile = Block.Create("div", {}, ["profileHeader", "header__profileHeader"])

        const chat = Block.Create("iframe", {"src": "http://127.0.0.1:3000/chat?mode=iframe", "height": "300px", "id":"iframe"}, ["main__chat"])

        this.el.append(chat)

        const register = {
            sign_in: Block.Create("a", {"href": "sign_in", "data-href": "sign_in"}, ["button_small", "sign-in"], "Sign in"),
            sign_up: Block.Create("a", {"href": "sign_up", "data-href": "sign_up"}, ["button_small", "sign-up"], "Sign up"),
            log_out: Block.Create("a", {"href": "log_out", "data-href": "log_out"}, ["log-out", "button_small"]),
            profile: Block.Create("a", {"href": "users/me", "data-href": "users/me"}, ["button_small", "headerProfileName"],),
        }

        const log_out_img = Block.Create("img", {"src": "../../img/logout.png"}, ["logoutpng"])
        register.log_out.append(log_out_img)


        if (this.hasProfile === true) {
            // const profileImg = Block.Create("a", {"href": "users/me"}, [],)
            const img = Block.Create("img", {"src": `${this.data.avatar}`}, ["avatar-40"])
            // profileImg.append(img)

            register.profile.setText(`${this.data.username}`)
            HeaderProfile
            // .append(profileImg)
                .append(img)
                .append(register.profile)
                .append(register.log_out)
        } else {
            HeaderProfile
                .append(register.sign_in)
                .append(register.sign_up)
        }

        header.forEach((newChild) => {
            MenuHeader.append(newChild)
		})
        body.forEach((newChild) => {
            MenuBody.append(newChild)
		})
        footer.forEach((newChild) => {
            MenuFooter.append(newChild)
        })

        MenuPage
            .append(MenuHeader.append(HeaderProfile))
            .append(MenuBody)
            .append(MenuFooter)
        this.el.append(MenuPage)
    }
}