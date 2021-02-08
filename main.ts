namespace SpriteKind {
    export const Thing = SpriteKind.create()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_cursor_pointer.overlapsWith(sprite_computer)) {
        sprites.setDataNumber(sprite_computer, "next_number", randint(0, max_height))
        sprite_computer.say(convertToText(sprites.readDataNumber(sprite_computer, "next_number")))
        check_for_magic_number(sprites.readDataNumber(sprite_computer, "next_number"))
    }
})
function animate_main_computer (animation_delay: number) {
    animation.runImageAnimation(
    sprite_computer,
    assets.animation`computer_monitor_loading`,
    animation_delay,
    true
    )
}
function make_cursor () {
    sprite_cursor = sprites.create(assets.image`cursor`, SpriteKind.Player)
    sprite_cursor_pointer = sprites.create(assets.image`cursor_pointer`, SpriteKind.Player)
    sprite_cursor_pointer.setStayInScreen(true)
    sprite_cursor.z = 50
    sprite_cursor_pointer.z = 50
    enable_cursor(true)
}
spriteutils.createRenderable(0, function (screen2) {
    screen2.fillRect(0, 0, 160, 20, 15)
    images.print(screen2, "Score: " + score, 2, 2, 1)
    images.print(screen2, "Target: " + magic_number, 2, 10, 1)
    screen2.drawLine(0, 20, 160, 20, 1)
    screen2.fillRect(0, 21, 56, 100, 13)
    screen2.drawLine(56, 20, 56, 120, 1)
})
function enable_cursor (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor_pointer, 100, 100)
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
    }
}
function check_for_magic_number (got: number) {
    if (got == magic_number) {
        effects.confetti.startScreenEffect(200)
        score += 1
        local_previous_magic_number = magic_number
        while (magic_number == local_previous_magic_number) {
            magic_number = randint(0, max_height)
        }
    }
}
function make_main_computer () {
    sprite_computer = sprites.create(assets.image`computer_monitor`, SpriteKind.Thing)
    sprite_computer.left = 16
    sprite_computer.y = scene.screenHeight() * 0.5
    animate_main_computer(500)
}
let local_previous_magic_number = 0
let sprite_cursor: Sprite = null
let sprite_computer: Sprite = null
let sprite_cursor_pointer: Sprite = null
let magic_number = 0
let max_height = 0
let score = 0
make_cursor()
make_main_computer()
scene.setBackgroundColor(11)
score = 0
max_height = 10
magic_number = randint(0, max_height)
game.onUpdate(function () {
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
})
