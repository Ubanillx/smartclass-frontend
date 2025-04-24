package com.smartclass.app;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import android.webkit.WebView;
import android.view.KeyEvent;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 初始化逻辑
    }
    
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_DOWN) {
            WebView webView = getBridge().getWebView();
            
            // 使用evaluateJavascript执行全局返回处理
            webView.evaluateJavascript("window.handleBackButton ? window.handleBackButton() : 'none'", result -> {
                Log.d(TAG, "JavaScript返回结果: " + result);
                
                if (result != null) {
                    result = result.trim().toLowerCase();
                    
                    if (result.equals("true")) {
                        // JavaScript处理了返回操作，不需要原生干预
                        Log.d(TAG, "JavaScript处理了返回操作");
                    } else if (result.equals("false") || result.equals("\"false\"")) {
                        // JavaScript返回false，直接退出应用
                        Log.d(TAG, "退出应用");
                        finish();
                    } else {
                        // 如果返回值不是true或false，尝试执行普通返回操作
                        Log.d(TAG, "执行默认返回操作");
                        webView.evaluateJavascript("window.history.back()", null);
                    }
                }
            });
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
