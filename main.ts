namespace SpriteKind {
    export const Thing = SpriteKind.create()
    export const Shop = SpriteKind.create()
}
namespace NumProp {
    export const cost = NumProp.create()
    export const id = NumProp.create()
    export const score = NumProp.create()
    export const autoclickers = NumProp.create()
    export const computers = NumProp.create()
    export const asics = NumProp.create()
    export const hashes_per_sec = NumProp.create()
}
namespace StrProp {
    export const name = StrProp.create()
    export const description = StrProp.create()
}
namespace AnyProp {
    export const requirements = AnyProp.create()
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
        computer_price = computer_price / 1.1
    } else if (blockMenu.selectedMenuOption().includes("Buy")) {
        computer_count += 1
        score += computer_price * -1
        computer_price = computer_price * 1.1
    }
    computer_price = Math.round(computer_price)
    move_till_not_touching(sprite_cursor_pointer, sprite_buy_computer, -1, 0)
}
function passed_requirements () {
    if (debug) {
        return true
    }
    if (score < blockObject.getNumberProperty(local_requirements, NumProp.score)) {
        return false
    }
    if (autoclicker_count < blockObject.getNumberProperty(local_requirements, NumProp.autoclickers)) {
        return false
    }
    if (computer_count < blockObject.getNumberProperty(local_requirements, NumProp.computers)) {
        return false
    }
    if (asic_count < blockObject.getNumberProperty(local_requirements, NumProp.asics)) {
        return false
    }
    if (average_hash_per_sec < blockObject.getNumberProperty(local_requirements, NumProp.hashes_per_sec)) {
        return false
    }
    return true
}
function number_to_si_divider (num: number) {
    if (num > 1e+24) {
        return 1e+24
    } else if (num > 1e+21) {
        return 1e+21
    } else if (num > 1000000000000000000) {
        return 1000000000000000000
    } else if (num > 1000000000000000) {
        return 1000000000000000
    } else if (num > 1000000000000) {
        return 1000000000000
    } else if (num > 1000000000) {
        return 1000000000
    } else if (num > 1000000) {
        return 1000000
    } else if (num > 1000) {
        return 1000
    } else {
        return 1
    }
}
function number_to_si_prefix (num: number) {
    if (num > 1e+24) {
        return "Y"
    } else if (num > 1e+21) {
        return "Z"
    } else if (num > 1000000000000000000) {
        return "E"
    } else if (num > 1000000000000000) {
        return "P"
    } else if (num > 1000000000000) {
        return "T"
    } else if (num > 1000000000) {
        return "G"
    } else if (num > 1000000) {
        return "M"
    } else if (num > 1000) {
        return "k"
    } else {
        return ""
    }
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
    upgrades_obtained = blockSettings.readNumberArray("game_upgrades_obtained")
    difficulty_halver_popup_time = blockSettings.readNumber("game_difficulty_halver_popup_time")
    old_difficulty = blockSettings.readNumber("game_old_difficulty")
    difficulty_halve_time_left = blockSettings.readNumber("game_difficulty_halve_time_left")
    difficulty_halve_max_time = blockSettings.readNumber("game_difficulty_halve_max_time")
    difficulty_halve_chance = blockSettings.readNumber("game_difficulty_halve_chance")
    difficulty_halving = read_bool("game_difficulty_halving")
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_cursor_pointer.overlapsWith(sprite_computer)) {
        computer_click()
    } else if (sprite_overlapping_kind(sprite_cursor_pointer, SpriteKind.Thing)) {
        difficulty_halving = true
        overlapped_sprites(sprite_cursor_pointer, SpriteKind.Thing)[0].destroy(effects.halo, 100)
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
        if (game.ask("Are you sure you want to", "wipe your save?")) {
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
function sprite_overlapping_kind (sprite: Sprite, kind: number) {
    for (let value of sprites.allOfKind(kind)) {
        if (sprite.overlapsWith(value)) {
            return true
        }
    }
    return false
}
function read_bool (name: string) {
    return blockSettings.readNumber(name) == 1
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
        asic_price = asic_price / 1.1
    } else if (blockMenu.selectedMenuOption().includes("Buy")) {
        asic_count += 1
        score += asic_price * -1
        asic_price = asic_price * 1.1
    }
    asic_price = Math.round(asic_price)
    move_till_not_touching(sprite_cursor_pointer, sprite_buy_asic, -1, 0)
}
function do_upgrade (id: number) {
    if (id == 0) {
        autoclicker_speed = autoclicker_speed * 0.5
    } else if (id == 1) {
        autoclicker_price = autoclicker_price * 0.5
    } else if (id == 2) {
        autoclicker_speed = autoclicker_speed * 0.333
    } else if (id == 3) {
        autoclicker_price = autoclicker_price * 0.5
    } else if (id == 4) {
        autoclicker_speed = autoclicker_speed * 0.25
    } else if (id == 5) {
        computer_speed = computer_speed * 0.5
    } else if (id == 6) {
        computer_speed = computer_speed * 0.333
    } else if (id == 7) {
        computer_price = computer_price * 0.5
    } else if (id == 8) {
        computer_speed = computer_speed * 0.166
    } else if (id == 9) {
        computer_speed = computer_speed * 0.333
    } else if (id == 10) {
        asic_speed = asic_speed * 0.5
    } else if (id == 11) {
        asic_price = asic_price * 0.5
    } else if (id == 12) {
        asic_speed = asic_speed * 0.333
    } else if (id == 13) {
        asic_speed = asic_speed * 0.5
    } else if (id == 14) {
        asic_price = asic_price * 0.5
    }
    autoclicker_speed = Math.floor(autoclicker_speed)
    computer_speed = Math.floor(computer_speed)
    asic_speed = Math.floor(asic_speed)
    autoclicker_price = Math.floor(autoclicker_price)
    computer_price = Math.floor(computer_price)
    asic_price = Math.floor(asic_price)
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
function make_upgrade_obj (name: string, description: string, cost: number, id: number, score_needed: number, autoclickers_needed: number, computers_needed: number, asics_needed: number, hashes_per_sec_needed: number) {
    local_upgrade_obj = blockObject.create()
    blockObject.setStringProperty(local_upgrade_obj, StrProp.name, name)
    blockObject.setStringProperty(local_upgrade_obj, StrProp.description, description)
    blockObject.setNumberProperty(local_upgrade_obj, NumProp.cost, cost)
    blockObject.setNumberProperty(local_upgrade_obj, NumProp.id, id)
    local_requirements_obj = blockObject.create()
    blockObject.setNumberProperty(local_requirements_obj, NumProp.score, score_needed)
    blockObject.setNumberProperty(local_requirements_obj, NumProp.autoclickers, autoclickers_needed)
    blockObject.setNumberProperty(local_requirements_obj, NumProp.computers, computers_needed)
    blockObject.setNumberProperty(local_requirements_obj, NumProp.asics, asics_needed)
    blockObject.setNumberProperty(local_requirements_obj, NumProp.hashes_per_sec, hashes_per_sec_needed)
    blockObject.setAnyProperty(local_upgrade_obj, AnyProp.requirements, local_requirements_obj)
    all_upgrades.push(local_upgrade_obj)
    return local_upgrade_obj
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
        autoclicker_price = autoclicker_price / 1.1
    } else if (blockMenu.selectedMenuOption().includes("Buy")) {
        autoclicker_count += 1
        score += autoclicker_price * -1
        autoclicker_price = autoclicker_price * 1.1
    }
    autoclicker_price = Math.round(autoclicker_price)
    move_till_not_touching(sprite_cursor_pointer, sprite_buy_autoclicker, -1, 0)
}
spriteutils.createRenderable(0, function (screen2) {
    screen2.fillRect(0, 0, 160, 20, 15)
    images.print(screen2, "MakeCoins: " + score, 2, 2, 1)
    if (difficulty_halving) {
        images.print(screen2, "Target: " + magic_number + " (" + difficulty_halve_time_left + ")", 2, 10, 1)
    } else {
        images.print(screen2, "Target: " + magic_number, 2, 10, 1)
    }
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
        images.print(screen2, "T/S: " + ticks_per_second + "/" + max_ticks_per_second, sprite_upgrades_button.left, sprite_upgrades_button.top - 15, 1)
    } else {
        images.print(screen2, pretty_hashes_per_sec(average_hash_per_sec), sprite_upgrades_button.left, sprite_upgrades_button.top - 15, 1)
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
function generate_new_target () {
    local_previous_magic_number = magic_number
    while (magic_number == local_previous_magic_number) {
        magic_number = randint(0, max_height)
    }
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
// name, description, cost, id, score needed, auto-clickers needed, computers needed, ASICs needed, hashes per second needed
function define_upgrades () {
    all_upgrades = []
    make_upgrade_obj("C++ Based Automation", "Double the speed of cursors.", 10, 0, 5, 1, 0, 0, 0)
    make_upgrade_obj("Make your own Autoclicker kits", "Halves the price of cursors.", 10, 1, 5, 2, 0, 0, 0)
    make_upgrade_obj("Hardware Autoclickers", "Triple the speed of cursors.", 15, 2, 10, 3, 0, 0, 0)
    make_upgrade_obj("Discounted Cursors", "Halves the price of cursors.", 15, 3, 10, 5, 0, 0, 0)
    make_upgrade_obj("USB 3.0 Cursors", "Quadruples the speed of cursors.", 20, 4, 10, 5, 0, 0, 0)
    make_upgrade_obj("Faster Mining Software", "Doubles the speed of computers.", 20, 5, 15, 0, 2, 0, 0)
    make_upgrade_obj("Switch to Linux", "Triples the speed of computers.", 30, 6, 20, 0, 5, 0, 0)
    make_upgrade_obj("Direct from the Factory", "Halves the price of computers.", 30, 7, 25, 0, 5, 0, 0)
    make_upgrade_obj("External GPUs", "Sextuples (x6!) the speed of computers.", 60, 8, 30, 0, 10, 0, 0)
    make_upgrade_obj("PCI Express buses", "Triples the speed of computers.", 40, 9, 30, 0, 10, 0, 0)
    make_upgrade_obj("Water cooling", "Doubles the speed of ASICs.", 75, 10, 50, 0, 0, 3, 0)
    make_upgrade_obj("Bulk buying", "Halves the price of ASICs.", 50, 11, 50, 0, 0, 5, 0)
    make_upgrade_obj("Firmware updates", "Triples the speed of ASICs.", 100, 12, 80, 0, 0, 5, 0)
    make_upgrade_obj("Improved ventilation", "Doubles the speed of ASICs.", 80, 13, 80, 0, 0, 5, 0)
    make_upgrade_obj("FPGAs are cheaper", "Halves the price of ASICs.", 100, 14, 80, 0, 0, 10, 0)
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
    upgrades_obtained = []
    difficulty_halver_popup_time = 10000
    old_difficulty = max_height
    difficulty_halve_time_left = 0
    difficulty_halve_max_time = 30
    difficulty_halve_chance = 2
    difficulty_halving = false
}
function wipe_save () {
    for (let value of blockSettings.list()) {
        if (value.indexOf("game") == 0) {
            blockSettings.remove(value)
        }
    }
    set_default_save()
}
function overlapped_sprites (sprite: Sprite, kind: number) {
    local_overlapping_sprites = []
    for (let value of sprites.allOfKind(kind)) {
        if (sprite.overlapsWith(value)) {
            local_overlapping_sprites.push(value)
        }
    }
    return local_overlapping_sprites
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
    blockSettings.writeNumberArray("game_upgrades_obtained", upgrades_obtained)
    blockSettings.writeNumber("game_difficulty_halver_popup_time", difficulty_halver_popup_time)
    blockSettings.writeNumber("game_old_difficulty", old_difficulty)
    blockSettings.writeNumber("game_difficulty_halve_time_left", difficulty_halve_time_left)
    blockSettings.writeNumber("game_difficulty_halve_max_time", difficulty_halve_max_time)
    blockSettings.writeNumber("game_difficulty_halve_chance", difficulty_halve_chance)
    save_bool("game_difficulty_halving", difficulty_halving)
}
function enable_cursor (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor_pointer, 100, 100)
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
    }
    sprite_cursor_pointer.setFlag(SpriteFlag.Invisible, !(en))
    sprite_cursor.setFlag(SpriteFlag.Invisible, !(en))
}
function save_bool (name: string, value: boolean) {
    if (value) {
        blockSettings.writeNumber(name, 1)
    } else {
        blockSettings.writeNumber(name, 0)
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
        generate_new_target()
    }
}
function get_upgrades_menu () {
    local_menu_options = ["Cancel"]
    local_available_upgrades = []
    local_upgrades_shown = 0
    for (let value of all_upgrades) {
        if (upgrades_obtained.indexOf(blockObject.getNumberProperty(value, NumProp.id)) != -1) {
            continue;
        }
        local_requirements = blockObject.getAnyProperty(value, AnyProp.requirements)
        if (passed_requirements()) {
            local_available_upgrades.push(value)
            local_menu_options.push("" + blockObject.getStringProperty(value, StrProp.name) + ": ($" + blockObject.getNumberProperty(value, NumProp.cost) + ") " + blockObject.getStringProperty(value, StrProp.description))
            local_upgrades_shown += 1
        }
        if (local_upgrades_shown >= 10) {
            break;
        }
    }
    blockMenu.showMenu(local_menu_options, MenuStyle.List, MenuLocation.FullScreen)
    wait_for_menu_select()
    if (blockMenu.selectedMenuOption().includes("Cancel")) {
    	
    } else {
        local_upgrade_got = local_available_upgrades[blockMenu.selectedMenuIndex() - 1]
        if (score >= blockObject.getNumberProperty(local_upgrade_got, NumProp.cost) || debug) {
            score += blockObject.getNumberProperty(local_upgrade_got, NumProp.cost) * -1
            do_upgrade(blockObject.getNumberProperty(local_upgrade_got, NumProp.id))
            upgrades_obtained.push(blockObject.getNumberProperty(local_upgrade_got, NumProp.id))
        } else {
            game.showLongText("Not enough MakeCoins!", DialogLayout.Bottom)
        }
    }
    move_till_not_touching(sprite_cursor_pointer, sprite_upgrades_button, 0, -1)
}
function make_difficulty_halving_status () {
    sprite_difficulty_halving_status_bar = statusbars.create(52, 2, StatusBarKind.Energy)
    sprite_difficulty_halving_status_bar.top = 22
    sprite_difficulty_halving_status_bar.left = 2
    sprite_difficulty_halving_status_bar.z = 0
    sprite_difficulty_halving_status_bar.setColor(7, 2, 5)
    sprite_difficulty_halving_status_bar.max = difficulty_halve_max_time
    sprite_difficulty_halving_status_bar.value = 0
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
function pretty_hashes_per_sec (hashes_per_sec: number) {
    return "" + number_to_si_prefix(hashes_per_sec) + "H/S: " + spriteutils.roundWithPrecision(hashes_per_sec / number_to_si_divider(hashes_per_sec), 2)
}
let sprite_difficulty_halver: Sprite = null
let sprite_difficulty_halving_status_bar: StatusBarSprite = null
let local_upgrade_got: blockObject.BlockObject = null
let local_upgrades_shown = 0
let local_available_upgrades: blockObject.BlockObject[] = []
let local_overlapping_sprites: Sprite[] = []
let local_previous_magic_number = 0
let selected = false
let all_upgrades: blockObject.BlockObject[] = []
let local_requirements_obj: blockObject.BlockObject = null
let local_upgrade_obj: blockObject.BlockObject = null
let sprite_cursor: Sprite = null
let sprite_menu_button: Sprite = null
let sprite_upgrades_button: Sprite = null
let sprite_buy_autoclicker: Sprite = null
let sprite_computer: Sprite = null
let difficulty_halving = false
let difficulty_halve_chance = 0
let difficulty_halve_max_time = 0
let difficulty_halve_time_left = 0
let old_difficulty = 0
let difficulty_halver_popup_time = 0
let upgrades_obtained: number[] = []
let asic_price = 0
let asic_speed = 0
let computer_speed = 0
let autoclicker_price = 0
let autoclicker_speed = 0
let magic_number = 0
let max_height = 0
let score_change = 0
let show_particles = false
let sprite_buy_asic: Sprite = null
let asic_count = 0
let autoclicker_count = 0
let local_requirements: blockObject.BlockObject = null
let sprite_buy_computer: Sprite = null
let sprite_cursor_pointer: Sprite = null
let score = 0
let computer_price = 0
let computer_count = 0
let local_menu_options: string[] = []
let average_hash_per_sec = 0
let ticks_per_second = 0
let max_ticks_per_second = 0
let debug = false
debug = false
max_ticks_per_second = 20
let raw_tick_count = 0
ticks_per_second = 0
let hash_count_per_sec = 0
let hash_per_sec = 0
average_hash_per_sec = 0
set_default_save()
make_cursor()
make_main_computer()
make_buttons()
define_upgrades()
scene.setBackgroundColor(11)
blockMenu.setColors(1, 15)
load_progress()
make_difficulty_halving_status()
game.onUpdate(function () {
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
})
game.onUpdate(function () {
    if (controller.A.isPressed()) {
        sprite_cursor.image.replace(1, 8)
        sprite_cursor.image.replace(9, 8)
        for (let value of overlapped_sprites(sprite_cursor_pointer, SpriteKind.Shop)) {
            value.image.replace(9, 8)
        }
    } else if (sprite_overlapping_kind(sprite_cursor_pointer, SpriteKind.Thing) || sprite_overlapping_kind(sprite_cursor_pointer, SpriteKind.Shop)) {
        sprite_cursor.image.replace(1, 9)
        sprite_cursor.image.replace(8, 9)
    } else {
        sprite_cursor.image.replace(9, 1)
        sprite_cursor.image.replace(8, 1)
    }
    for (let value of sprites.allOfKind(SpriteKind.Shop)) {
        if (sprite_cursor_pointer.overlapsWith(value)) {
            value.image.replace(1, 9)
        } else {
            value.image.replace(8, 9)
            value.image.replace(9, 1)
        }
    }
})
game.onUpdateInterval(1000, function () {
    hash_per_sec = hash_count_per_sec
    hash_count_per_sec = 0
    average_hash_per_sec += hash_per_sec
    average_hash_per_sec = spriteutils.roundWithPrecision(average_hash_per_sec / 2, 2)
    ticks_per_second = raw_tick_count
    raw_tick_count = 0
})
forever(function () {
    timer.throttle("tick", 1000 / max_ticks_per_second, function () {
        for (let index = 0; index <= autoclicker_count - 1; index++) {
            timer.throttle("autoclicker_click_" + index, autoclicker_speed, function () {
                computer_click()
            })
        }
        for (let index = 0; index <= computer_count - 1; index++) {
            timer.throttle("computer_mine_" + index, computer_speed, function () {
                check_for_magic_number(randint(0, max_height))
                hash_count_per_sec += 1
            })
        }
        for (let index = 0; index <= asic_count - 1; index++) {
            timer.throttle("asic_mine_" + index, asic_speed, function () {
                check_for_magic_number(randint(0, max_height))
                hash_count_per_sec += 1
            })
        }
        raw_tick_count += 1
    })
})
forever(function () {
    if (Math.floor(average_hash_per_sec) >= max_height && !(difficulty_halving)) {
        while (Math.floor(average_hash_per_sec) >= max_height) {
            max_height = Math.floor(max_height * 1.5)
            score_change = Math.ceil(score_change * 1.5)
        }
        Notification.waitForNotificationFinish()
        Notification.notify("Difficulty has been set to " + max_height + "!" + " (Reward is $" + score_change + ")", assets.image`arrow`)
    }
    pause(1000)
})
forever(function () {
    if ((Math.percentChance(difficulty_halve_chance) || false) && !(difficulty_halving)) {
        timer.throttle("summon_difficulty_halver", difficulty_halver_popup_time, function () {
            sprite_difficulty_halver = sprites.create(assets.image`difficulty_halver`, SpriteKind.Thing)
            sprite_difficulty_halver.z = 30
            sprite_difficulty_halver.setPosition(randint(0, scene.screenWidth()), randint(0, scene.screenHeight()))
            sprite_difficulty_halver.setStayInScreen(true)
            sprite_difficulty_halver.startEffect(effects.halo, 1750)
            sprite_difficulty_halver.lifespan = difficulty_halver_popup_time
        })
    }
    if (difficulty_halving && difficulty_halve_time_left == 0) {
        Notification.waitForNotificationFinish()
        old_difficulty = max_height
        max_height = Math.round(max_height * 0.5)
        difficulty_halve_time_left = difficulty_halve_max_time
        generate_new_target()
        timer.background(function () {
            Notification.notify("Difficulty has been halved for " + difficulty_halve_max_time + " seconds! (" + old_difficulty + " --> " + max_height + ")", assets.image`down_arrow`)
        })
    }
    if (difficulty_halving) {
        difficulty_halve_time_left += -1
    }
    if (difficulty_halving && difficulty_halve_time_left <= 0) {
        max_height = old_difficulty
        difficulty_halving = false
    }
    pause(1000)
})
forever(function () {
    sprite_difficulty_halving_status_bar.value = difficulty_halve_time_left
    sprite_difficulty_halving_status_bar.setFlag(SpriteFlag.Invisible, !(difficulty_halving))
})
