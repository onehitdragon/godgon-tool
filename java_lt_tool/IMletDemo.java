import javax.microedition.lcdui.*;
import javax.microedition.midlet.*;

public class IMletDemo extends MIDlet {

    public void startApp() {
        Display display = Display.getDisplay(this);
        display.setCurrent(new GameCanvas());
        System.out.println("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
    }

    public void destroyApp(boolean unconditional) {

    }

    protected void pauseApp() {

    }
}