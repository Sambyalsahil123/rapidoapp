package com.company.begataxi;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import expo.modules.ReactActivityDelegateWrapper;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "BegaDriver";
    }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }



    // protected void onCreate(Bundle savedInstanceState) {
	// 	if (savedInstanceState != null) {
	// 		savedInstanceState.remove("android:support:fragments");
	// 		savedInstanceState.remove("android:fragments");
	// 	}
    //            super.onCreate(savedInstanceState);
    // }
  

    /**
    * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
    * you can specify the rendered you wish to use (Fabric or the older renderer).
    */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegateWrapper(
            this,
            new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
            }
        );
    }
    
    public static class MainActivityDelegate extends ReactActivityDelegate {
        public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
        super(activity, mainComponentName);
        }
        @Override
        protected ReactRootView createRootView() {
        ReactRootView reactRootView = new ReactRootView(getContext());
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
        return reactRootView;
        }

        @Override
            protected boolean isConcurrentRootEnabled() {
            // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
            // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }
    }


}