package com.springsecurity.jquery.example

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.SecurityProperties
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.web.csrf.CsrfFilter
import org.springframework.security.web.csrf.CsrfTokenRepository
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.ModelAndView

import javax.servlet.http.HttpServletRequest
import java.security.Principal

@SpringBootApplication
@RestController
class SpringSecurityJqueryExampleApplication {

    @RequestMapping("/resource")
    public Map<String, Object> home() {
        [
            id: UUID.randomUUID().toString(),
            content: "Server Generated Content..."
        ]
    }

    @RequestMapping("/user")
    public Principal user(Principal user) {
        return user;
    }

    @RequestMapping("/logout")
    public ModelAndView logout(HttpServletRequest req) {
        req.logout();
    }

    @Configuration
    @Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
    protected static class SecurityConfiguration extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                .httpBasic()
                .and()
                    .authorizeRequests()
                    .antMatchers("/index.html").permitAll()
                    .anyRequest().authenticated()
                .and()
                    .addFilterAfter(new CsrfHeaderFilter(), CsrfFilter)
                .csrf()
                    .csrfTokenRepository(csrfTokenRepository())
        }
    }

    private static CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-XSRF-TOKEN");
        return repository;
    }


    static void main(String[] args) {
        SpringApplication.run SpringSecurityJqueryExampleApplication, args
    }
}
