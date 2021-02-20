namespace SpriteKind {
    export const Thing = SpriteKind.create()
    export const Shop = SpriteKind.create()
}
namespace NumProp {
    export const cost = NumProp.create()
    export const id = NumProp.create()
}
namespace StrProp {
    export const name = StrProp.create()
    export const description = StrProp.create()
}
function buy_computer_menu () {
    local_menu_options = ["Cancel"]
    if (computer_count > 0) {
        local_menu_options.push("Sell for $" + Math.round(computer_price * 0.8))
    }
    if (score >= computer_price || debug) {
        local_menu_options.push("Buy for $" + computer_price)
    }
    blockMenu.showMenu(local_menu_options, MenuStyle.List, MenuLocation.BottomLeft)
    wait_for_menu_select()
    if (blockMenu.selectedMenuOption().includes("Cancel")) {
    	
    } else if (blockMenu.selectedMenuOption().includes("Sell")) {
        computer_count += -1
        score += Math.round(computer_price * 0.8)
    } else if (blockMenu.selectedMenuOption().includes("Buy")) {
        computer_count += 1
        score += computer_price * -1
    }
    computer_price = 10
    for (let index = 0; index < computer_count; index++) {
        computer_price = computer_price * 1.1
    }
    computer_price = Math.round(computer_price)
    move_till_not_touching(sprite_cursor_pointer, sprite_buy_computer, -1, 0)
}
function make_buttons () {
    make_buy_autoclicker()
    make_buy_computer()
    make_buy_asic()
    make_upgrades_button()
    make_menu_button()
}
function make_buy_asic () {
    sprite_buy_asic = sprites.create(assets.image`buy_asic_button`, SpriteKind.Shop)
    sprite_buy_asic.top = 72
    sprite_buy_asic.left = 60
}
function load_progress () {
    if (!(blockSettings.exists("game_saves"))) {
        return
    }
    if (blockSettings.readNumber("game_show_particles") == 0) {
        show_particles = false
    } else {
        show_particles = true
    }
    score = blockSettings.readNumber("game_score")
    score_change = blockSettings.readNumber("game_score_change")
    max_height = blockSettings.readNumber("game_max_height")
    magic_number = blockSettings.readNumber("game_magic_number")
    autoclicker_count = blockSettings.readNumber("game_autoclicker_count")
    autoclicker_speed = blockSettings.readNumber("game_autoclicker_speed")
    autoclicker_price = blockSettings.readNumber("game_autoclicker_price")
    computer_count = blockSettings.readNumber("game_computer_count")
    computer_speed = blockSettings.readNumber("game_computer_speed")
    computer_price = blockSettings.readNumber("game_computer_price")
    asic_count = blockSettings.readNumber("game_asic_count")
    asic_speed = blockSettings.readNumber("game_asic_speed")
    asic_price = blockSettings.readNumber("game_asic_price")
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_cursor_pointer.overlapsWith(sprite_computer)) {
        computer_click()
    } else if (sprite_cursor_pointer.overlapsWith(sprite_buy_autoclicker)) {
        buy_autoclicker_menu()
    } else if (sprite_cursor_pointer.overlapsWith(sprite_buy_computer)) {
        buy_computer_menu()
    } else if (sprite_cursor_pointer.overlapsWith(sprite_buy_asic)) {
        buy_asic_menu()
    } else if (sprite_cursor_pointer.overlapsWith(sprite_upgrades_button)) {
        get_upgrades_menu()
    } else if (sprite_cursor_pointer.overlapsWith(sprite_menu_button)) {
        menu_menu()
    }
})
function menu_menu () {
    local_menu_options = ["Cancel"]
    local_menu_options.push("Save progress")
    local_menu_options.push("Wipe save")
    local_menu_options.push("Toggle confetti")
    blockMenu.showMenu(local_menu_options, MenuStyle.List, MenuLocation.BottomLeft)
    wait_for_menu_select()
    if (blockMenu.selectedMenuOption().includes("Cancel")) {
    	
    } else if (blockMenu.selectedMenuOption().includes("Save")) {
        save_progress()
        timer.background(function () {
            Notification.waitForNotificationFinish()
            Notification.notify("Saved progress!", assets.image`floppy_disc`)
        })
    } else if (blockMenu.selectedMenuOption().includes("Wipe")) {
        if (game.ask("Are you sure you", "want to wipe save?")) {
            wipe_save()
            timer.background(function () {
                Notification.waitForNotificationFinish()
                Notification.notify("Save wiped!", assets.image`trash_bin`)
            })
        }
    } else if (blockMenu.selectedMenuOption().includes("Toggle")) {
        show_particles = !(show_particles)
    }
    move_till_not_touching(sprite_cursor_pointer, sprite_menu_button, 0, -1)
}
function buy_asic_menu () {
    local_menu_options = ["Cancel"]
    if (asic_count > 0) {
        local_menu_options.push("Sell for $" + Math.round(asic_price * 0.8))
    }
    if (score >= asic_price || debug) {
        local_menu_options.push("Buy for $" + asic_price)
    }
    blockMenu.showMenu(local_menu_options, MenuStyle.List, MenuLocation.BottomLeft)
    wait_for_menu_select()
    if (blockMenu.selectedMenuOption().includes("Cancel")) {
    	
    } else if (blockMenu.selectedMenuOption().includes("Sell")) {
        asic_count += -1
        score += Math.round(asic_price * 0.8)
    } else if (blockMenu.selectedMenuOption().includes("Buy")) {
        asic_count += 1
        score += asic_price * -1
    }
    asic_price = 100
    for (let index = 0; index < asic_count; index++) {
        asic_price = asic_price * 1.1
    }
    asic_price = Math.round(asic_price)
    move_till_not_touching(sprite_cursor_pointer, sprite_buy_asic, -1, 0)
}
function move_till_not_touching (sprite: Sprite, other_sprite: Sprite, dx: number, dy: number) {
    while (sprite.overlapsWith(other_sprite)) {
        sprite.x += dx
        sprite.y += dy
        pause(0)
    }
}
function make_cursor () {
    sprite_cursor = sprites.create(assets.image`cursor`, SpriteKind.Player)
    sprite_cursor_pointer = sprites.create(assets.image`cursor_pointer`, SpriteKind.Player)
    sprite_cursor_pointer.setStayInScreen(true)
    sprite_cursor.z = 50
    sprite_cursor_pointer.z = 50
    enable_cursor(true)
}
function make_upgrade_obj (name: string, description: string, cost: number, id: number) {
    local_upgrade_obj = blockObject.create()
    blockObject.setStringProperty(local_upgrade_obj, StrProp.name, name)
    blockObject.setStringProperty(local_upgrade_obj, StrProp.description, description)
    blockObject.setNumberProperty(local_upgrade_obj, NumProp.cost, cost)
    blockObject.setNumberProperty(local_upgrade_obj, NumProp.id, id)
}
function wait_for_menu_select () {
    enable_cursor(false)
    selected = false
    while (!(selected)) {
        pause(100)
    }
    blockMenu.closeMenu()
    enable_cursor(true)
}
function buy_autoclicker_menu () {
    local_menu_options = ["Cancel"]
    if (autoclicker_count > 0) {
        local_menu_options.push("Sell for $" + Math.round(autoclicker_price * 0.8))
    }
    if (score >= autoclicker_price || debug) {
        local_menu_options.push("Buy for $" + autoclicker_price)
    }
    blockMenu.showMenu(local_menu_options, MenuStyle.List, MenuLocation.BottomLeft)
    wait_for_menu_select()
    if (blockMenu.selectedMenuOption().includes("Cancel")) {
    	
    } else if (blockMenu.selectedMenuOption().includes("Sell")) {
        autoclicker_count += -1
        score += Math.round(autoclicker_price * 0.8)
    } else if (blockMenu.selectedMenuOption().includes("Buy")) {
        autoclicker_count += 1
        score += autoclicker_price * -1
    }
    autoclicker_price = 2
    for (let index = 0; index < autoclicker_count; index++) {
        autoclicker_price = autoclicker_price * 1.1
    }
    autoclicker_price = Math.round(autoclicker_price)
    move_till_not_touching(sprite_cursor_pointer, sprite_buy_autoclicker, -1, 0)
}
spriteutils.createRenderable(0, function (screen2) {
    screen2.fillRect(0, 0, 160, 20, 15)
    images.print(screen2, "MakeCoins: " + score, 2, 2, 1)
    images.print(screen2, "Target: " + magic_number, 2, 10, 1)
    screen2.drawLine(0, 20, 160, 20, 1)
})
spriteutils.createRenderable(0, function (screen2) {
    screen2.fillRect(0, 21, 56, 100, 13)
    screen2.drawLine(56, 20, 56, 120, 1)
})
spriteutils.createRenderable(0, function (screen2) {
    screen2.fillRect(0, 80, 56, 40, 15)
    screen2.drawLine(0, 80, 56, 80, 1)
    for (let index = 0; index <= 4; index++) {
        images.print(screen2, convertToText(randint(100000000, 999999999)), 1, 82 + index * 7, 7)
    }
})
spriteutils.createRenderable(0, function (screen2) {
    images.print(screen2, "Shop:", 58, 22, 1)
    images.print(screen2, "Cost: $" + autoclicker_price, sprite_buy_autoclicker.right + 4, sprite_buy_autoclicker.top, 1)
    images.print(screen2, "Have: " + autoclicker_count, sprite_buy_autoclicker.right + 4, sprite_buy_autoclicker.bottom - 8, 1)
    images.print(screen2, "Cost: $" + computer_price, sprite_buy_computer.right + 4, sprite_buy_computer.top, 1)
    images.print(screen2, "Have: " + computer_count, sprite_buy_computer.right + 4, sprite_buy_computer.bottom - 8, 1)
    images.print(screen2, "Cost: $" + asic_price, sprite_buy_asic.right + 4, sprite_buy_asic.top, 1)
    images.print(screen2, "Have: " + asic_count, sprite_buy_asic.right + 4, sprite_buy_asic.bottom - 8, 1)
})
spriteutils.createRenderable(0, function (screen2) {
    if (controller.B.isPressed()) {
        images.print(screen2, "Raw H/S: " + hash_per_sec, sprite_upgrades_button.left, sprite_upgrades_button.top - 15, 1)
    } else {
        images.print(screen2, "H/S: " + average_hash_per_sec, sprite_upgrades_button.left, sprite_upgrades_button.top - 15, 1)
    }
})
spriteutils.createRenderable(0, function (screen2) {
    screen2.drawLine(56, sprite_upgrades_button.top - 3, 160, sprite_upgrades_button.top - 3, 1)
})
function make_upgrades_button () {
    sprite_upgrades_button = sprites.create(assets.image`upgrades_button`, SpriteKind.Shop)
    sprite_upgrades_button.left = 60
    sprite_upgrades_button.bottom = scene.screenHeight() - 2
    images.print(sprite_upgrades_button.image, "Upgrades Menu", 2, 2, 15)
}
function make_buy_autoclicker () {
    sprite_buy_autoclicker = sprites.create(assets.image`buy_autoclicker_button`, SpriteKind.Shop)
    sprite_buy_autoclicker.top = 32
    sprite_buy_autoclicker.left = 60
}
function make_buy_computer () {
    sprite_buy_computer = sprites.create(assets.image`buy_computer_button`, SpriteKind.Shop)
    sprite_buy_computer.top = 52
    sprite_buy_computer.left = 60
}
function set_default_save () {
    show_particles = true
    score = 0
    score_change = 1
    max_height = 5
    magic_number = randint(0, max_height)
    autoclicker_count = 0
    autoclicker_speed = 10000
    autoclicker_price = 2
    computer_count = 0
    computer_speed = 1000
    computer_price = 10
    asic_count = 0
    asic_speed = 200
    asic_price = 100
}
function wipe_save () {
    for (let value of blockSettings.list()) {
        if (value.indexOf("game") == 0) {
            blockSettings.remove(value)
        }
    }
    set_default_save()
}
function computer_click () {
    hash_count_per_sec += 1
    sprites.setDataNumber(sprite_computer, "next_number", randint(0, max_height))
    sprite_computer.say(convertToText(sprites.readDataNumber(sprite_computer, "next_number")))
    sprite_computer.setImage(assets.animation`computer_monitor_loading`[sprites.readDataNumber(sprite_computer, "loading_step")])
    sprites.setDataNumber(sprite_computer, "loading_step", sprites.readDataNumber(sprite_computer, "loading_step") + 1)
    if (sprites.readDataNumber(sprite_computer, "loading_step") == assets.animation`computer_monitor_loading`.length) {
        sprites.setDataNumber(sprite_computer, "loading_step", 0)
    }
    check_for_magic_number(sprites.readDataNumber(sprite_computer, "next_number"))
}
function save_progress () {
    if (blockSettings.exists("game_saves")) {
        blockSettings.writeNumber("game_saves", blockSettings.readNumber("game_saves") + 1)
    } else {
        blockSettings.writeNumber("game_saves", 1)
    }
    if (show_particles) {
        blockSettings.writeNumber("game_show_particles", 1)
    } else {
        blockSettings.writeNumber("game_show_particles", 0)
    }
    blockSettings.writeNumber("game_score", score)
    blockSettings.writeNumber("game_score_change", score_change)
    blockSettings.writeNumber("game_max_height", max_height)
    blockSettings.writeNumber("game_magic_number", magic_number)
    blockSettings.writeNumber("game_autoclicker_count", autoclicker_count)
    blockSettings.writeNumber("game_autoclicker_speed", autoclicker_speed)
    blockSettings.writeNumber("game_autoclicker_price", autoclicker_price)
    blockSettings.writeNumber("game_computer_count", computer_count)
    blockSettings.writeNumber("game_computer_speed", computer_speed)
    blockSettings.writeNumber("game_computer_price", computer_price)
    blockSettings.writeNumber("game_asic_count", asic_count)
    blockSettings.writeNumber("game_asic_speed", asic_speed)
    blockSettings.writeNumber("game_asic_price", asic_price)
}
function enable_cursor (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor_pointer, 100, 100)
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
    }
}
function make_menu_button () {
    sprite_menu_button = sprites.create(assets.image`menu_button`, SpriteKind.Shop)
    sprite_menu_button.left = sprite_upgrades_button.right + 2
    sprite_menu_button.bottom = scene.screenHeight() - 2
}
function check_for_magic_number (got: number) {
    if (got == magic_number) {
        if (show_particles) {
            effects.confetti.startScreenEffect(200)
        }
        score += score_change
        local_previous_magic_number = magic_number
        while (magic_number == local_previous_magic_number) {
            magic_number = randint(0, max_height)
        }
    }
}
function get_upgrades_menu () {
	
}
function make_main_computer () {
    sprite_computer = sprites.create(assets.image`computer_monitor`, SpriteKind.Thing)
    sprite_computer.left = 16
    sprite_computer.y = scene.screenHeight() * 0.5
    sprites.setDataNumber(sprite_computer, "loading_step", 0)
}
blockMenu.onMenuOptionSelected(function (option, index) {
    selected = true
})
let local_previous_magic_number = 0
let selected = false
let local_upgrade_obj: blockObject.BlockObject = null
let sprite_cursor: Sprite = null
let sprite_menu_button: Sprite = null
let sprite_upgrades_button: Sprite = null
let sprite_buy_autoclicker: Sprite = null
let sprite_computer: Sprite = null
let asic_price = 0
let asic_speed = 0
let asic_count = 0
let computer_speed = 0
let autoclicker_price = 0
let autoclicker_speed = 0
let autoclicker_count = 0
let magic_number = 0
let max_height = 0
let score_change = 0
let show_particles = false
let sprite_buy_asic: Sprite = null
let sprite_buy_computer: Sprite = null
let sprite_cursor_pointer: Sprite = null
let score = 0
let computer_price = 0
let computer_count = 0
let local_menu_options: string[] = []
let average_hash_per_sec = 0
let hash_per_sec = 0
let debug = false
debug = true
let hash_count_per_sec = 0
hash_per_sec = 0
average_hash_per_sec = 0
set_default_save()
make_cursor()
make_main_computer()
make_buttons()
scene.setBackgroundColor(11)
blockMenu.setColors(1, 15)
load_progress()
game.onUpdate(function () {
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
})
game.onUpdateInterval(1000, function () {
    hash_per_sec = hash_count_per_sec
    hash_count_per_sec = 0
    average_hash_per_sec += hash_per_sec
    average_hash_per_sec = spriteutils.roundWithPrecision(average_hash_per_sec / 2, 2)
})
forever(function () {
    for (let index = 0; index <= autoclicker_count - 1; index++) {
        timer.throttle("autoclicker_click_" + index, autoclicker_speed, function () {
            computer_click()
        })
    }
})
forever(function () {
    for (let index = 0; index <= computer_count - 1; index++) {
        timer.throttle("computer_mine_" + index, computer_speed, function () {
            check_for_magic_number(randint(0, max_height))
            hash_count_per_sec += 1
        })
    }
})
forever(function () {
    for (let index = 0; index <= asic_count - 1; index++) {
        timer.throttle("asic_mine_" + index, asic_speed, function () {
            check_for_magic_number(randint(0, max_height))
            hash_count_per_sec += 1
        })
    }
})
