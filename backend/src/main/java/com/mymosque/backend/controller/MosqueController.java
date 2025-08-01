package com.mymosque.backend.controller;

import com.mymosque.backend.model.Mosque;
import com.mymosque.backend.repository.MosqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mosques")
public class MosqueController {

    @Autowired
    private MosqueRepository mosqueRepository;

    @PostMapping("/register")
    public Mosque registerMosque(@RequestBody Mosque mosque) {
        return mosqueRepository.save(mosque);
    }

    @GetMapping
    public List<Mosque> getAllMosques() {
        return mosqueRepository.findAll();
    }
}
