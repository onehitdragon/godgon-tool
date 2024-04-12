import javax.microedition.lcdui.Canvas;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

public class GameCanvas extends Canvas{
    private Image img;

    public GameCanvas(){
        try {
            img = Image.createImage("6.png");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void paint(Graphics g) {
        g.drawImage(img, 10, 10, Graphics.TOP | Graphics.LEFT);
    }
}
